import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../user/schemas/user.schema";
import { Model } from "mongoose";
import { RegisterDto } from "./dtos/register.dto";
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./dtos/login.dto";

@Injectable()
export class ClientAuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private jwtService: JwtService
  ) { }

  async register(registerDto: RegisterDto): Promise<any> {
    // Kiểm tra có trùng email không
    const emailExist = await this.userModel.findOne({
      email: registerDto.email,
      deleted: false
    })
    if (emailExist) {
      throw new ConflictException('Email đã tồn tại trong hệ thống');
    }

    // hash mật khẩu
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);
    registerDto.password = hashedPassword;

    // tạo refresh token
    const refreshToken = crypto.randomBytes(64).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const newUser = await this.userModel.create({
      ...registerDto,
      refreshToken: refreshToken,
      refreshTokenExpiresAt: expiresAt
    })

    // tạo access token là chuỗi JWT
    const payload = {
      sub: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email
    };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET || 'dksjksaljkjijljdiwis',
      expiresIn: '15m'
    })

    return {
      accessToken,
      refreshToken
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
}