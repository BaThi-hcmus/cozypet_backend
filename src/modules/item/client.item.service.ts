import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Item, ItemDocument } from "./schemas/item.schema";
import { Model } from "mongoose";

@Injectable()
export class ClientItemService {
  constructor(
    @InjectModel(Item.name) private readonly itemModel: Model<ItemDocument>
  ) { }

  async getAllItems(): Promise<ItemDocument[]> {
    const items = this.itemModel.find({
      deleted: false,
      status: 'active'
    })

    return items;
  }
}