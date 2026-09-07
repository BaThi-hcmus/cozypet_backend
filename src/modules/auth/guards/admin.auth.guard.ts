import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Account, AccountDocument } from "src/modules/account/schemas/account.schema";

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(
    @InjectModel(Account.name) private readonly accountModel: Model<AccountDocument>
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const sessionId = request.cookies?.sessionId;

    if (!sessionId) {
      throw new UnauthorizedException('Vui lòng đăng nhập lại');
    }

    const accountExist = await this.accountModel.findOne({
      sessionId: sessionId,
      status: 'active',
      deleted: false
    }).select('-password');

    if (!accountExist) {
      throw new UnauthorizedException('Phiên đăng nhập không hợp lệ hoặc đã hết hạn');
    }

    request.info = accountExist;

    return true;
  }
}