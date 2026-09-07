import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class ClientUserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) { }

  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId).select('-password -refreshToken -refreshTokenExpiresAt -deleted').lean();
    if (!user) {
      throw new NotFoundException('Không tìm thấy thông tin user');
    }
    return user;
  }
}
