import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../user/schemas/user.schema";
import { Connection, Model, Types } from "mongoose";
import { RegisterDto } from "./dtos/register.dto";
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./dtos/login.dto";
import { Room, RoomDocument } from "../room/schemas/room.schema";
import { UserRoom, UserRoomDocument } from "../room/schemas/user-rooms.schema";
import { UserItem, UserItemDocument } from "../item/schemas/user-items.schema";
import { Item, ItemDocument } from "../item/schemas/item.schema";
import { Pet, PetDocument } from "../pet/schemas/pet.schema";
import { PetTemplate, PetTemplateDocument } from "../pet/schemas/pet-template.schema";

@Injectable()
export class ClientAuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Room.name) private readonly roomModel: Model<RoomDocument>,
    @InjectModel(UserRoom.name) private readonly userRoomModel: Model<UserRoomDocument>,
    @InjectModel(UserItem.name) private readonly userItemModel: Model<UserItemDocument>,
    @InjectModel(Item.name) private readonly itemModel: Model<ItemDocument>,
    @InjectModel(Pet.name) private readonly petModel: Model<PetDocument>,
    @InjectModel(PetTemplate.name) private readonly petTemplateModel: Model<PetTemplateDocument>,
    @InjectConnection() private readonly connection: Connection,
    private jwtService: JwtService
  ) { }

  async register(registerDto: RegisterDto): Promise<any> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const emailExist = await this.userModel.findOne({
        email: registerDto.email,
        deleted: false
      }).session(session);

      if (emailExist) {
        throw new ConflictException('Email đã tồn tại trong hệ thống');
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);
      registerDto.password = hashedPassword;

      // Tạo refresh token
      const refreshToken = crypto.randomBytes(64).toString('hex');
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      const newUserArray = await this.userModel.create(
        [{
          ...registerDto,
          refreshToken: refreshToken,
          refreshTokenExpiresAt: expiresAt
        }],
        { session }
      );
      const newUser = newUserArray[0];

      // lấy ra các item free
      const freeItems = await this.itemModel.find({
        price: 0,
        status: 'active',
        deleted: false
      }).session(session);
      // lưu freeItems vào user-items
      const newUserItems = freeItems.map((item) => {
        return {
          userId: newUser._id,
          itemId: item._id,
          quantity: 1
        }
      })
      await this.userItemModel.insertMany(newUserItems, { session });

      // lấy ra các room free
      const freeRooms = await this.roomModel.find({
        price: 0,
        status: 'active',
        deleted: false
      }).session(session);
      // lưu freeRooms vào UserRoom
      const newUserRooms: any = [];
      for (const room of freeRooms) {
        const newUserRoom = {
          userId: newUser._id,
          roomId: room._id,
          isCurrent: room.code === 'LIVING_ROOM',
          decorations: {}
        };
        // nếu là bed room thì sẽ có thêm thuộc tính isLightOn
        if (room.code == 'BED_ROOM') {
          newUserRoom[`isLightOn`] = false;
        }

        const slotKeys = room.slots ? Object.keys(room.slots) : [];
        for (const slotKey of slotKeys) {
          const defaultItemId = room.slots[slotKey].defaultItemId;
          if (!defaultItemId) continue;
          const userItem = await this.userItemModel.findOne({
            userId: newUser._id,
            itemId: new Types.ObjectId(defaultItemId.toString()),
          }).session(session);
          if (userItem) {
            newUserRoom.decorations[slotKey] = userItem._id;
          }
        }

        newUserRooms.push(newUserRoom);
      };

      await this.userRoomModel.insertMany(newUserRooms, { session });

      // gọi commit lưu vào DB
      await session.commitTransaction();

      const payload = {
        sub: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email
      };
      const accessToken = this.jwtService.sign(payload, {
        secret: process.env.ACCESS_TOKEN_SECRET || 'dksjksaljkjijljdiwis',
        expiresIn: '15m'
      });

      return {
        accessToken,
        refreshToken
      };
    } catch (error) {
      // nếu có lỗi thì hủy tấc cả
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async login(loginDto: LoginDto): Promise<any> {
    const { email, password } = loginDto;
    // Kiểm tra email tồn tại chưa
    const user = await this.userModel.findOne({
      email: email,
      deleted: false
    })
    if (!user) {
      throw new UnauthorizedException('Thông tin đăng nhập không chính xác');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Thông tin đăng nhập không chính xác');
    }

    const payload = {
      sub: user._id,
      fullName: user.fullName,
      email: user.email
    }
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: '15m'
    });

    const refreshToken = crypto.randomBytes(64).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // cập nhật bản ghi
    await this.userModel.updateOne(
      { _id: user._id },
      {
        refreshToken: refreshToken,
        refreshTokenExpiresAt: expiresAt
      }
    )

    return {
      accessToken,
      refreshToken
    }
  }

  async refreshToken(oldRefreshToken: string): Promise<any> {
    const user = await this.userModel.findOne({
      refreshToken: oldRefreshToken,
      refreshTokenExpiresAt: { $gt: new Date() }
    });
    if (!user) {
      throw new UnauthorizedException('Refresh token không hợp lệ hoặc đã hết hạn');
    }

    // cấp access token mới
    const payload = {
      sub: user._id,
      fullName: user.fullName,
      email: user.email
    }
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: '15m'
    });

    return {
      accessToken
    }
  }

  async logout(userId: string): Promise<void> {
    await this.userModel.updateOne(
      { _id: userId },
      {
        $unset: {
          refreshToken: 1,
          refreshTokenExpiresAt: 1
        }
      }
    );
  }

  async getAllInfo(userId: string): Promise<any> {
    try {
      const userObjectId = Types.ObjectId.isValid(userId)
        ? new Types.ObjectId(userId)
        : userId;

      const [user, pets, userRooms, userItems] = await Promise.all([
        this.userModel.findOne({
          _id: userId,
          status: 'active',
          deleted: false
        }).select('-password -refreshToken -refreshTokenExpiresAt -deleted'),

        this.petModel.find({
          userId: userId,
          deleted: false
        }),

        this.userRoomModel.find({
          userId: { $in: [userObjectId, userId] },
        }),

        this.userItemModel.find({
          userId: { $in: [userObjectId, userId] },
        })
      ]);

      if (!user) {
        throw new UnauthorizedException('Không tìm thấy thông tin người dùng');
      }

      const petTemplateIds = pets
        .map((pet) => pet.petTemplateId)
        .filter(Boolean);

      const petTemplateObjectIds = petTemplateIds
        .filter((id) => Types.ObjectId.isValid(id))
        .map((id) => new Types.ObjectId(id.toString()));

      const roomIds = userRooms.map((room) => room.roomId);
      // kho đồ user đang sở hữu
      const inventoryItemIds = userItems.map((item) => item.itemId);

      const [petTemplates, rooms] = await Promise.all([
        this.petTemplateModel.find({
          $or: [
            { _id: { $in: petTemplateObjectIds } },
            { templateId: { $in: petTemplateIds.map((id) => id.toString()) } },
          ],
          status: 'active',
          deleted: false
        }),

        this.roomModel.find({
          _id: { $in: roomIds },
          status: 'active',
          deleted: false
        }),
      ]);

      const defaultItemIds = rooms.flatMap((room) =>
        Object.values(room.slots || {})
          .map((slot: any) => slot?.defaultItemId)
          .filter(Boolean)
      );

      // bao gồm item user đang sở hữu và các item mặc định trong room
      const allItemIds = [...inventoryItemIds, ...defaultItemIds];

      const items = await this.itemModel.find({
        _id: { $in: allItemIds },
        status: 'active',
        deleted: false
      });

      return {
        profile: user,
        pets: pets,
        petTemplates: petTemplates,
        userRooms: userRooms,
        rooms: rooms,
        userItems: userItems,
        items: items
      };

    } catch (error) {
      throw error;
    }
  }
}