import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateFlashcardSetDto } from './dto/create-flashcard-set.dto';
import { UpdateFlashcardSetDto } from './dto/update-flashcard-set.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  FlashcardSet,
  FlashcardSetDocument,
} from './entities/flashcard-set.entity';
import { DeleteResult, Model, Types, UpdateResult } from 'mongoose';
import { AccountsService } from 'src/accounts/accounts.service';

@Injectable()
export class FlashcardSetsService {
  constructor(
    @InjectModel(FlashcardSet.name)
    private readonly flashcardSetModel: Model<FlashcardSetDocument>,
    private readonly accountService: AccountsService,
  ) {}

  async create(
    createFlashcardSetDto: CreateFlashcardSetDto,
    user: any,
  ): Promise<FlashcardSet> {
    const account = await this.accountService.findOne(user.accountId);
    if (!account) {
      throw new NotFoundException(`Account Not Found`);
    }

    const existingFlashcardSet = await this.flashcardSetModel.findOne({
      title: createFlashcardSetDto.title,
      account: user.accountId,
    });

    if (existingFlashcardSet) {
      throw new BadRequestException(
        'Flashcard Set With This Title Already Exists In Your Account',
      );
    }
    const newFlashcardSet = (
      await this.flashcardSetModel.create({
        ...createFlashcardSetDto,
        account: user.accountId,
      })
    ).toObject();
    return newFlashcardSet;
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<{
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    previousPage: number | null;
    nextPage: number | null;
    items: FlashcardSet[];
  }> {
    const skip = (page - 1) * limit;
    const total = await this.flashcardSetModel.countDocuments();
    const totalPages = Math.ceil(total / limit);

    const items: FlashcardSet[] = await this.flashcardSetModel
      .find()
      .skip(skip)
      .limit(limit)
      .populate('account', 'username avatarUrl')
      .lean()
      .exec();

    return {
      total,
      page,
      limit,
      totalPages,
      hasPreviousPage: page > 1,
      hasNextPage: page < totalPages,
      previousPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      items,
    };
  }

  async findOne(id: string) {
    const flashcardSet = await this.flashcardSetModel
      .findById(id)
      .populate('account', 'username avatarUrl')
      .lean()
      .exec();
    if (!flashcardSet) {
      throw new NotFoundException(`Flashcard Set with ID ${id} not found`);
    }

    return flashcardSet.toObject();
  }

  async update(
    id: string,
    updateFlashcardSetDto: UpdateFlashcardSetDto,
    user: any,
  ) {
    const account = await this.accountService.findOne(user.accountId);
    if (!account) {
      throw new NotFoundException('Account Not Found');
    }

    const flashcardSet = await this.findOne(id);

    updateFlashcardSetDto.description =
      updateFlashcardSetDto.description ?? flashcardSet.description;

    if (account._id !== flashcardSet.account) {
      throw new UnauthorizedException('Only Author Can Delete This Comment');
    }

    const result: UpdateResult = await this.flashcardSetModel.updateOne(
      { _id: id },
      { $set: updateFlashcardSetDto },
    );

    if (!result.acknowledged) {
      throw new InternalServerErrorException('Flashcard Set Update Failed');
    }

    return result;
  }

  async remove(id: string, user: any): Promise<DeleteResult> {
    const account = await this.accountService.findOne(user.accountId);
    if (!account) {
      throw new NotFoundException('Account Not Found');
    }

    const flashcardSet: FlashcardSet | null = await this.findOne(id);

    if (account._id !== flashcardSet.account) {
      throw new UnauthorizedException('Only Author Can Delete This Comment');
    }

    const result: DeleteResult =
      await this.flashcardSetModel.deleteOne(flashcardSet);

    if (!result.acknowledged) {
      throw new InternalServerErrorException('Flashcard Set Deletion Failed');
    }

    return result;
  }

  async addLike(id: string) {
    const flashcardSet: FlashcardSet | null = await this.findOne(id);

    flashcardSet.likes = flashcardSet.likes + 1;

    const result: UpdateResult = await this.flashcardSetModel.updateOne(
      { _id: id },
      { $set: flashcardSet },
    );

    if (!result.acknowledged) {
      throw new InternalServerErrorException('Flashcard Set Deletion Failed');
    }

    return result;
  }

  async removeLike(id: string) {
    const flashcardSet: FlashcardSet | null = await this.findOne(id);

    flashcardSet.likes = flashcardSet.likes - 1;
    if (flashcardSet.likes <= 0) {
      flashcardSet.likes = 0;
    }

    const result: UpdateResult = await this.flashcardSetModel.updateOne(
      { _id: id },
      { $set: flashcardSet },
    );

    if (!result.acknowledged) {
      throw new InternalServerErrorException('Flashcard Set Deletion Failed');
    }

    return result;
  }
}
