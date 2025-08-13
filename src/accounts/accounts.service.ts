import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Account, AccountDocument } from './entities/account.entity';
import { Model } from 'mongoose';
import { SignupDto } from '../common/dto/signup.dto';
import bcrypt from 'bcryptjs';

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

    if (createAccountDto.password !== createAccountDto.confirmPassword) {
      throw new BadRequestException('Passwords Do Not Match');
    }

    const newAccount = (
      await this.accountModel.create(createAccountDto)
    ).toObject();
    return newAccount;
  }

  async createAccountFromSignup(signupDto: SignupDto): Promise<Account | null> {
    if (signupDto === null) {
      return null;
    }

    const newAccount = (await this.accountModel.create(signupDto)).toObject();
    return newAccount;
  }

  findAll() {
    return `This action returns all accounts`;
  }

  async findOne(id: string) {
    const account = await this.accountModel.findById(id).lean().exec();
    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }

    const { password, ...omittedAccount } = account;

    return omittedAccount;
  }

  async findOneWithoutOmittedField(id: string) {
    const account = await this.accountModel.findById(id).lean().exec();
    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }

    return account;
  }

  async updateAccountPassword(id: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedAccount = await this.accountModel.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true },
    );

    if (!updatedAccount) {
      throw new NotFoundException(`Account with ID ${id} not found`);
      // return false;
    }

    return updatedAccount;
  }

  update(id: number, updateAccountDto: UpdateAccountDto) {
    return `This action updates a #${id} account`;
  }

  remove(id: number) {
    return `This action removes a #${id} account`;
  }

  async findOneByEmail(email: string): Promise<AccountDocument | null> {
    return await this.accountModel
      .findOne({
        email: email,
      })
      .exec();
  }
  async findOneByUsername(username: string): Promise<AccountDocument | null> {
    return await this.accountModel
      .findOne({
        username: username,
      })
      .exec();
  }
}
