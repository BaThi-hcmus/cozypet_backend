import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account, AccountDocument } from './schemas/account.schema';
import { CreateAccountDto } from './dtos/create.account.dto';
import { UpdateAccountDto } from './dtos/update.account.dto';
import * as bcrypt from 'bcrypt'
import { FilterStatus } from 'src/utils/filterStatus.util';
import { Search } from 'src/utils/search.util';
import { Pagination } from 'src/utils/pagination.util';
import { Sort } from 'src/utils/sort.util';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
    private readonly filterStatusService: FilterStatus,
    private readonly searchService: Search,
    private readonly paginationService: Pagination,
    private readonly sortService: Sort
  ) { };

  async getAll(
    status: string,
    keyword: string,
    page: string,
    sortType: string
  ): Promise<any> {
    const queryCondition: any = {
      deleted: false
    }

    // Lọc trạng thái
    const statusList = [
      {
        name: "Tấc cả",
        status: "",
        class: "active"
      },
      {
        name: "Hoạt động",
        status: "active",
        class: ""
      },
      {
        name: "Dừng hoạt động",
        status: "inactive",
        class: ""
      }
    ];
    this.filterStatusService.filterStatus(status, statusList, queryCondition);

    // Tìm kiếm
    const fieldSearch = ['fullName', 'email', 'phoneNumber', 'role'];
    this.searchService.search(keyword, fieldSearch, queryCondition);

    // Sắp xếp
    const sortList = [
      {
        name: "Họ tên tăng dần",
        type: "fullName-asc"
      },
      {
        name: "Họ tên giảm dần",
        type: "fullName-desc"
      },
      {
        name: "Email tăng dần",
        type: "email-asc"
      },
      {
        name: "Email giảm dần",
        type: "email-desc"
      },
      {
        name: "Mới nhất",
        type: "createdAt-desc"
      },
      {
        name: "Cũ nhất",
        type: "createdAt-asc"
      }
    ]
    const sortCondition = this.sortService.sort(sortType, sortList);

    // Phân trang
    const paginationObj = await this.paginationService.pagination(page, queryCondition, this.accountModel);

    const accounts = await this.accountModel
      .find(queryCondition)
      .select('-password')
      .sort(sortCondition)
      .skip(paginationObj.startIndex)
      .limit(paginationObj.itemPerPage);

    return {
      accounts: accounts,
      statusList: statusList,
      keyword: keyword,
      sortType: sortType,
      sortList: sortList,
      paginationObj: paginationObj
    }
  }

  async createAccount(createAccountDto: CreateAccountDto): Promise<void> {
    const { email, password, ...rest } = createAccountDto;

    // Kiểm tra email trùng
    // kiểm tra cả những bản ghi đã xóa mềm, vì email được gán unique
    const accountExist = await this.accountModel.findOne({ email: email });
    if (accountExist) {
      throw new ConflictException('Email này đã được sử dụng bởi tài khoản khác');
    }

    // Mã hóa mật khẩu
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);

    // Tạo bản ghi
    const newAccount = new this.accountModel({
      email: email,
      password: hashPassword,
      ...rest
    })

    await newAccount.save();
  }

  async updateAccount(id: string, updateAccountDto: UpdateAccountDto): Promise<void> {
    // Kiểm tra tài khoản có tồn tại không
    const accountExist = await this.accountModel.findOne({ _id: id, deleted: false });
    if (!accountExist) {
      throw new NotFoundException('Tài khoản không tồn tại trong hệ thống');
    }

    // xử lí password
    if (updateAccountDto.password && updateAccountDto.password.trim().length > 0) {
      const saltRounds = 10;
      const hashPassword = await bcrypt.hash(updateAccountDto.password, saltRounds);
      updateAccountDto.password = hashPassword;
    }

    // xử lý email
    if (updateAccountDto.email != accountExist.email) {
      const emailExist = await this.accountModel.findOne({ email: updateAccountDto.email, deleted: false });
      if (emailExist) {
        throw new ConflictException('Email vừa sửa đổi đã có tài khoản khác sử dụng');
      }
    }

    // update dữ liệu
    await this.accountModel.updateOne(
      { _id: id },
      updateAccountDto
    )
  }

  async detailAccount(id: string): Promise<AccountDocument> {
    const account = await this.accountModel
      .findOne({ _id: id, deleted: false })
      .select('-password');
    if (!account) {
      throw new NotFoundException('Tài khoản không tồn tại');
    }
    return account;
  }

  async deleteAccount(id: string): Promise<void> {
    // kiểm tra account có tồn tại không 
    const accountExist = await this.accountModel.findOne({
      _id: id,
      deleted: false
    })
    if (!accountExist) {
      throw new NotFoundException('Tài khoản cần xóa không tồn tại');
    }

    await this.accountModel.updateOne(
      { _id: id },
      { deleted: true }
    )
  }
}
