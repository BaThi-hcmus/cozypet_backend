import { Injectable } from "@nestjs/common";

@Injectable()
export class Sort {
  sort = (
    sortType: string,
    sortList: any[]
  ) => {
    const sortCondition: any = {};
    if (sortType && sortType.trim().length > 0) {
      // Kiểm tra sortType có nằm trong các tiêu chí sort hợp lệ không 
      const sortTypeExist = sortList.find(item => item.type == sortType);

      if (sortTypeExist) {
        const [sortKey, sortValue] = sortType.split('-');
        sortCondition[sortKey] = sortValue;
      }
    } else {
      sortCondition.createdAt = -1;
    }

    return sortCondition;
  }
}