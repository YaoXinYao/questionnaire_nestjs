import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AnswerService } from './answer.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AddAnswerDto } from './dto/add-answer.dto';
import { EntityManager } from 'typeorm';

@ApiTags('answer')
@ApiBearerAuth() //token鉴权
@Controller('answer')
export class AnswerController {
  constructor(
    private readonly answerService: AnswerService,
    private readonly entityManager: EntityManager,
  ) {}

  //统计问卷
  @Get('statByQuestionId')
  @ApiQuery({ name: 'questionId', required: false, type: Number })
  @ApiQuery({ name: 'answerKey', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  async statByQuestionId(
    @Query('questionId') questionId: number,
    @Query('answerKey') answerKey: string,
  ) {
    return await this.answerService.statByQuestionId(questionId, answerKey);
  }

  //用户是否做过
  @Get('isDone')
  @ApiQuery({ name: 'questionnaireId', required: true, type: Number })
  @ApiQuery({ name: 'userId', required: true, type: Number })
  async isDone(
    @Query('questionnaireId') questionnaireId: number,
    @Query('userId') userId: number,
  ) {
    return await this.answerService.isDone(questionnaireId, userId);
  }

  //提交答案
  @Post('submitAnswer')
  @ApiBody({ type: AddAnswerDto })
  async submitAnswer(@Body() addAnswerDto: AddAnswerDto) {
    const { userId, answerList, qId } = addAnswerDto;
    return await this.answerService.submitAnswerService(
      this.entityManager,
      userId,
      qId,
      answerList,
    );
  }

  //根据问卷id查询提交列表
  @Get('getSubmitList')
  async getSubmitList(
    @Query('qId') qId: number,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return await this.answerService.getSubmitListService({
      qId,
      page,
      pageSize,
    });
  }
}
