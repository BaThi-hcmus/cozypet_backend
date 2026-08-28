import { Injectable } from "@nestjs/common";

@Injectable()
export class FilterStatus {
  filterStatus = (
    status: string,
    statusList: any,
    queryCondition: any
  ) => {
    if (status) {
      const item = statusList.find(item => item.status == status);

      if (item) {
        statusList.forEach(item => item.class = "");
        item.class = "active";
        queryCondition.status = status;
      }
    }
  }
}