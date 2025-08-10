import { AccountsService } from './../accounts/accounts.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from './entities/comment.entity';
import { DeleteResult, Model, UpdateResult } from 'mongoose';
import { FlashcardSetsService } from 'src/flashcard-sets/flashcard-sets.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
    private readonly flashcardSetService: FlashcardSetsService,
    private readonly accountService: AccountsService,
  ) {}

  async create(createCommentDto: CreateCommentDto, user: any) {
    const account = await this.accountService.findOne(user.accountId);
    if (!account) {
      throw new NotFoundException(`Account Not Found`);
    }

    const flashcardSet = await this.flashcardSetService.findOne(
      createCommentDto.flashcardSetId,
    );
    if (!flashcardSet) {
      throw new NotFoundException('Flashcard Set Not Found');
    }

    const newComment = await this.commentModel.create({
      ...createCommentDto,
      account: account._id,
      flashcardSet: flashcardSet._id,
    });
    return newComment.toObject();
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
    items: Comment[];
  }> {
    const skip = (page - 1) * limit;
    const total = await this.commentModel.countDocuments();
    const totalPages = Math.ceil(total / limit);

    const items: Comment[] = await this.commentModel
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
    const comment = await this.commentModel.findById(id).lean().exec();
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    return comment.toObject();
  }

  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<UpdateResult | undefined> {
    const comment = await this.findOne(id);

    updateCommentDto.content = updateCommentDto.content ?? comment.content;

    if (updateCommentDto.content === comment.content) {
      return;
    }

    const result: UpdateResult = await this.commentModel.updateOne(
      { _id: id },
      { $set: updateCommentDto },
    );
    if (!result.acknowledged) {
      throw new BadRequestException('Comment Update Failed');
    }

    return result;
  }

  async remove(id: string): Promise<DeleteResult> {
    const comment = await this.findOne(id);

    const result: DeleteResult = await this.commentModel.deleteOne(comment);
    if (!result.acknowledged) {
      throw new BadRequestException('Comment Deletion Failed');
    }

    return result;
  }
}
