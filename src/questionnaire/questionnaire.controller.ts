import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { QuestionnaireService } from './questionnaire.service';
import { CreateQuestionnaireDto } from './dto/create-questionnaire.dto';
import { UpdateQuestionnaireDto } from './dto/update-questionnaire.dto';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Query } from '@nestjs/common';
import { AddQuestionDto } from './dto/add-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { type } from 'os';

@ApiTags('questionnaire')
@ApiBearerAuth() //token鉴权
@Controller('questionnaire')
export class QuestionnaireController {
  constructor(private readonly questionnaireService: QuestionnaireService) {}

  @Post('createQuestionnaire')
  create(@Body() createQuestionnaireDto: CreateQuestionnaireDto) {
    return this.questionnaireService.create(createQuestionnaireDto);
  }

  @Post('addQuestion')
  @ApiBody({ type: [AddQuestionDto] })
  addQuestion(@Body() addQuestionDtos: Array<AddQuestionDto>) {
    return this.questionnaireService.addQuestionItems(addQuestionDtos);
  }

  @Patch('updateQuestionItem')
  @ApiBody({ type: [UpdateQuestionDto] })
  updateQuestionItem(@Body() updateQuestions: Array<UpdateQuestionDto>) {
    return this.questionnaireService.updateQuestionItem(updateQuestions);
  }

  @Delete('deleteQuestionItems')
  deleteQuestionItem(@Query('ids') ids: Array<number>) {
    return this.questionnaireService.deleteQuestionItems(ids);
  }

  @Post('updateQuestionItemIndex')
  updateQuestionItemIndex(@Body() indexArr: Array<number>) {
    return this.questionnaireService.updateQuestionItemIndex(indexArr);
  }

  @Get('findByUserId')
  findByUserId(@Query('id') id: number) {
    return this.questionnaireService.findByUserId(id);
  }

  @Get('find')
  @ApiQuery({ name: 'id', required: false, type: Number })
  @ApiQuery({ name: 'title', required: false, type: String })
  @ApiQuery({ name: 'isPublished', required: false, type: Boolean })
  @ApiQuery({ name: 'isDeleted', required: false, type: Boolean })
  @ApiQuery({ name: 'creatorId', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  async findById(
    @Query('id') id: number,
    @Query('title') title?: string,
    @Query('isPublished') isPublished?: number,
    @Query('isDeleted') isDeleted?: number,
    @Query('creatorId') creatorId?: number,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return await this.questionnaireService.find(
      id,
      title,
      isPublished,
      isDeleted,
      creatorId,
      page,
      pageSize,
    );
  }

  @Get('getQuestionnaireInfo')
  getQuestionnaireInfo(@Query('id') id: number) {
    return this.questionnaireService.getQuestionnaireInfo(id);
  }

  @Patch('updateQuestionnaire')
  update(@Body() updateQuestionnaireDto: UpdateQuestionnaireDto) {
    return this.questionnaireService.update(updateQuestionnaireDto);
  }

  @Delete('deleteQuestionnaire')
  async remove(@Query('ids') ids: number[]) {
    return await this.questionnaireService.remove(ids);
  }
}
