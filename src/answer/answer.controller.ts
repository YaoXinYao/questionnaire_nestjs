import {
  Controller,
  Get,
  Post,
  Body,
  Query,
} from '@nestjs/common';
import { AnswerService } from './answer.service';
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
  @ApiQuery({ name: 'searchKey', required: false, type: String })
  async getSubmitList(
    @Query('qId') qId: number,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('searchKey') searchKey: string,
  ) {
    return await this.answerService.getSubmitListService({
      qId,
      page,
      pageSize,
      searchKey,
    });
  }

  @Get('getUserAnswer')
  async getUserAnswer(
    @Query('userId') userId: number,
    @Query('questionnaireId') questionaireId: number,
  ) {
    return await this.answerService.getUserAnswerService(
      userId,
      questionaireId,
    );
  }
}
