import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from '../common/decorator/user.decorator';
import type { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post()
  create(@Body() createCommentDto: CreateCommentDto, @User() user: any) {
    return this.commentsService.create(createCommentDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get()
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.commentsService.findAll(page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @User() user: any,
    @Res() res: Response,
  ) {
    const result = this.commentsService.update(id, updateCommentDto, user);
    if (result === undefined) {
      return res.status(204).json({
        message: 'Comment Content Did Not Change',
      });
    } else {
      return res.status(200).json(result);
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: any) {
    return this.commentsService.remove(id, user);
  }
}
