import { Injectable } from "@nestjs/common";

@Injectable()
export class Search {
  search = (
    keyword: string,
    fields: string[],
    queryCondition: any
  ) => {
    if (keyword && keyword.trim().length > 0) {
      const query: any[] = [];
      fields.forEach(field => {
        query.push({
          [field]: { $regex: keyword, $options: 'i' }
        })
      })

      //thêm vào điều kiện truy vấn gốc
      queryCondition.$or = query;
    }
  }
}