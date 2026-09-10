import { Controller, Get } from "@nestjs/common";
import { ClientItemService } from "./client.item.service";

@Controller('items')
export class ClientItemController {
  constructor(
    private readonly itemService: ClientItemService
  ) { }

  @Get()
  async getAllItems() {
    const data = await this.itemService.getAllItems();

    return {
      data,
      message: 'Lấy toàn bộ item trong hệ thống thành công'
    }
  }
}