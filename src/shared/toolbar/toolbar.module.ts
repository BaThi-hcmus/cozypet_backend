import { Module } from "@nestjs/common";
import { FilterStatus } from "src/utils/filterStatus.util";
import { Search } from "src/utils/search.util";
import { Pagination } from "src/utils/pagination.util";
import { Sort } from "src/utils/sort.util";

@Module({
  providers: [FilterStatus, Search, Pagination, Sort],
  exports: [FilterStatus, Search, Pagination, Sort],
})

export class ToolBarModule { };
