import { Injectable } from "@nestjs/common";

export interface PaginationResult {
  currentPage: number;
  itemPerPage: number;
  totalItem: number;
  totalPage: number;
  startIndex: number;
}

@Injectable()
export class Pagination {
  pagination = async (
    currentPage: string,
    queryCondition: any,
    repo: any
  ): Promise<PaginationResult> => {
    const paginationObj: any = {
      currentPage: 1,
      itemPerPage: 10
    };

    if (currentPage) {
      const page = Number(currentPage) > 0 ? Number(currentPage) : 1;
      paginationObj.currentPage = page;
    }

    // tính tổng số phần tử và tổng số trang
    paginationObj.totalItem = await repo.countDocuments(queryCondition);
    paginationObj.totalPage = Math.ceil(paginationObj.totalItem / paginationObj.itemPerPage);

    // tính vị trí bắt đầu của trang hiện tại
    paginationObj.startIndex = (paginationObj.currentPage - 1) * paginationObj.itemPerPage;

    return paginationObj;
  }
}