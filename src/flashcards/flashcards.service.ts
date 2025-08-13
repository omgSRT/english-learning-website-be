import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateFlashcardDto } from './dto/create-flashcard.dto';
import { UpdateFlashcardDto } from './dto/update-flashcard.dto';
import { Flashcard, FlashcardDocument } from './entities/flashcard.entity';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult, Model, UpdateResult } from 'mongoose';
import { FlashcardSetsService } from '../flashcard-sets/flashcard-sets.service';

@Injectable()
export class FlashcardsService {
  constructor(
    @InjectModel(Flashcard.name)
    private readonly flashcardModel: Model<FlashcardDocument>,
    @Inject(forwardRef(() => FlashcardSetsService))
    private readonly flashcardSetService: FlashcardSetsService,
  ) {}

  async create(createFlashcardDto: CreateFlashcardDto, user: any) {
    const flashcardSet = await this.flashcardSetService.findOne(
      createFlashcardDto.flashcardSetId,
    );
    if (!flashcardSet) {
      throw new NotFoundException('Flashcard Set Not Found');
    }
    if (String(user.accountId) !== String(flashcardSet.account._id)) {
      throw new BadRequestException(
        'You Are Not The Author Of This Flashcard Set',
      );
    }

    const newFlashcard = (
      await this.flashcardModel.create({
        ...createFlashcardDto,
        flashcardSet: flashcardSet._id,
      })
    ).toObject();
    flashcardSet.flashcards.push(newFlashcard._id);
    return newFlashcard;
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
    items: Flashcard[];
  }> {
    const skip = (page - 1) * limit;
    const total = await this.flashcardModel.countDocuments();
    const totalPages = Math.ceil(total / limit);

    const items: Flashcard[] = await this.flashcardModel
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
    const flashcard = await this.flashcardModel.findById(id).lean().exec();
    if (!flashcard) {
      throw new NotFoundException(`Flashcard Set with ID ${id} not found`);
    }

    return flashcard.toObject();
  }

  async update(id: string, updateFlashcardDto: UpdateFlashcardDto) {
    const flashcard = await this.findOne(id);

    for (const key in updateFlashcardDto) {
      if (
        (updateFlashcardDto[key] === '' ||
          updateFlashcardDto[key] === null ||
          updateFlashcardDto[key] === undefined) &&
        key in flashcard
      ) {
        updateFlashcardDto[key] = flashcard[key];
      }
    }

    const result: UpdateResult = await this.flashcardModel.updateOne(
      { _id: id },
      { $set: updateFlashcardDto },
    );
    if (!result.acknowledged) {
      throw new InternalServerErrorException('Flashcard Update Failed');
    }

    return result;
  }

  async remove(id: string): Promise<DeleteResult> {
    const flashcard = await this.findOne(id);

    const flashcardSet = await this.flashcardSetService.findOne(
      flashcard._id.toHexString(),
    );
    if (!flashcardSet) {
      throw new NotFoundException('Flashcard Set Not Found');
    }

    const result: DeleteResult = await this.flashcardModel.deleteOne(flashcard);

    if (!result.acknowledged) {
      throw new InternalServerErrorException('Flashcard Deletion Failed');
    }
    const index = flashcardSet.flashcards.indexOf(flashcard._id);
    if (index > -1) {
      flashcardSet.flashcards.splice(index, 1);
    }

    return result;
  }
}
