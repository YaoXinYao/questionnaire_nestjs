import { Module } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { AnswerController } from './answer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from './entities/answer.entity';
import { Question } from 'src/questionnaire/entities/question.entity';
import { AnswerUser } from './entities/answerUser.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Answer, Question, AnswerUser])],
  controllers: [AnswerController],
  providers: [AnswerService],
})
export class AnswerModule {}
