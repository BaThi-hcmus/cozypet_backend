import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private jwtService: JwtService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // Lấy token từ header
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Không tìm thấy access token hợp lệ.');
    }

    const token = authHeader.split(' ')[1];

    try {
      // Xác thực chữ ký và thời hạn của token
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });

      request['user'] = payload;
    } catch {
      // Nếu token hết hạn hoặc giả mạo
      throw new UnauthorizedException('Access Token không hợp lệ hoặc đã hết hạn.');
    }

    return true;
  }
}