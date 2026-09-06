import { Controller } from '@nestjs/common';
import { ClientUserService } from './client.user.service';

@Controller('user')
export class ClientUserController {
  constructor(private readonly userService: ClientUserService) { }
}
