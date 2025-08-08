import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Account, AccountDocument } from './entities/account.entity';
import { Model } from 'mongoose';

@Injectable()
export class AccountsService {
  constructor(
    @InjectModel(Account.name)
    private readonly accountModel: Model<AccountDocument>,
  ) {}

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    const existingAccountByEmail = await this.findOneByEmail(
      createAccountDto.email,
    );
    if (existingAccountByEmail) {
      throw new BadRequestException('Email Already Exists');
    }
    const existingAccountByUsername = await this.findOneByUsername(
      createAccountDto.username,
    );
    if (existingAccountByUsername) {
      throw new BadRequestException('Username Already Exists');
    }

    const newAccount = await this.accountModel.create(createAccountDto);
    return newAccount;
  }

  findAll() {
    return `This action returns all accounts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} account`;
  }

  update(id: number, updateAccountDto: UpdateAccountDto) {
    return `This action updates a #${id} account`;
  }

  remove(id: number) {
    return `This action removes a #${id} account`;
  }

  async findOneByEmail(email: string): Promise<Account | null> {
    const accountFoundByEmail = await this.accountModel.findOne({
      email: email,
    });
    if (accountFoundByEmail) {
      return accountFoundByEmail;
    }
    return null;
  }
  async findOneByUsername(username: string): Promise<Account | null> {
    const accountFoundByUsername = await this.accountModel.findOne({
      username: username,
    });
    if (accountFoundByUsername) {
      return accountFoundByUsername;
    }
    return null;
  }
}
