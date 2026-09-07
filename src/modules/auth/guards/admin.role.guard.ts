import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/admin.role.decorator';

@Injectable()
export class AdminRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    // Lấy danh sách role được phép truy cập từ Decorator @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Nếu API không gắn decorator @Roles thì mặc định cho qua
    if (!requiredRoles) {
      return true;
    }

    // Lấy thông tin user đã được gán từ AdminAuthGuard chạy trước đó
    const request = context.switchToHttp().getRequest();
    const user = request.info;

    // Kiểm tra xem role của user có nằm trong danh sách cho phép không
    const hasPermission = requiredRoles.includes(user?.role);

    if (!hasPermission) {
      throw new ForbiddenException('Bạn không có quyền thực hiện hành động này.');
    }

    return true;
  }
}