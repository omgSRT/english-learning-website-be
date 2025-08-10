import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateFlashcardSetDto } from './dto/create-flashcard-set.dto';
import { UpdateFlashcardSetDto } from './dto/update-flashcard-set.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  FlashcardSet,
  FlashcardSetDocument,
} from './entities/flashcard-set.entity';
import { DeleteResult, Model, UpdateResult } from 'mongoose';

@Injectable()
export class FlashcardSetsService {
  constructor(
    @InjectModel(FlashcardSet.name)
    private readonly flashcardSetModel: Model<FlashcardSetDocument>,
  ) {}

  async create(
    createFlashcardSetDto: CreateFlashcardSetDto,
    user: any,
  ): Promise<FlashcardSet> {
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

  async findOne(id: string): Promise<FlashcardSet> {
    const flashcardSet: FlashcardSet | null = await this.flashcardSetModel
      .findById(id)
      .populate('account', 'username avatarUrl')
      .lean()
      .exec();
    if (!flashcardSet) {
      throw new NotFoundException(`Flashcard Set with ID ${id} not found`);
    }

    return flashcardSet;
  }

  async update(id: string, updateFlashcardSetDto: UpdateFlashcardSetDto) {
    const flashcardSet = await this.findOne(id);

    const result: UpdateResult = await this.flashcardSetModel.updateOne(
      { _id: id },
      { $set: updateFlashcardSetDto },
    );

    if (!result.acknowledged) {
      throw new InternalServerErrorException('Flashcard Set Update Failed');
    }

    return result;
  }

  async remove(id: string): Promise<DeleteResult> {
    const flashcardSet: FlashcardSet | null = await this.findOne(id);

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
