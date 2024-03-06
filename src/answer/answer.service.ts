import { Injectable } from '@nestjs/common';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Answer } from './entities/answer.entity';
import { EntityManager, Repository } from 'typeorm';
import { Question } from 'src/questionnaire/entities/question.entity';
import { ServiceReturnType } from 'src/type/service';
import { getTime } from 'src/publicMethods/userMethods';
import { AnswerUser } from './entities/answerUser.entity';
let chooseQuestionsType = ['questionCheckbox', 'questionRadio'];

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer)
    private answerRepository: Repository<Answer>,

    @InjectRepository(Question)
    private questionRepository: Repository<Question>,

    @InjectRepository(AnswerUser)
    private answerUserRepository: Repository<AnswerUser>,
  ) {}

  async isDone(
    questionnaireId: number,
    userId: number,
  ): Promise<ServiceReturnType> {
    try {
      let res = await this.answerUserRepository.findBy({
        qId: questionnaireId,
        userId,
      });
      console.log(res);
      if (res.length) {
        return { code: 0, info: true };
      } else {
        return { code: 0, info: false };
      }
    } catch (error) {
      console.error(error);
      return { code: -1, info: '操作失败' };
    }
  }

  async statByQuestionId(
    questionId: number,
    answerKey?: string,
  ): Promise<ServiceReturnType> {
    let questionInfo = await this.questionRepository.findOneBy({
      id: questionId,
    });
    console.log(questionInfo);
    const CHOOSETYPE = ['questionRadio', 'questionCheckbox'];

    if (questionInfo) {
      let { type } = questionInfo;
      if (type == CHOOSETYPE[0]) {
        let statRes = await this.answerRepository.findAndCountBy({
          questionId,
          answer: answerKey,
        });
        console.log(statRes[1]);

        return { code: 0, info: statRes[1] };
      }
    } else {
      return { code: -1, info: '查询失败' };
    }
    try {
    } catch (error) {
      console.log(error);
      return { code: -1, info: '查询失败' };
    }
  }

  // 提交答案
  async submitAnswerService(
    entityManager: EntityManager,
    userId: number,
    qId: number,
    answerList: Array<{ questionId: number; answer: string }>,
  ) {
    try {
      let res = await this.isDone(qId, userId);
      if (res.info) {
        return { code: 0, info: '该用户已做过该答卷' };
      }
      // 开启一个事务
      await entityManager.transaction(
        async (transactionalEntityManager: EntityManager) => {
          // 使用批量插入的方式保存答案
          await transactionalEntityManager
            .createQueryBuilder()
            .insert()
            .into(Answer)
            .values(
              answerList.map((answer) => ({
                userId,
                ...answer,
                create_time: getTime(),
              })),
            )
            .execute();

          // 将 answerUserRepository.save({ userId, qId, create_time: getTime() }) 添加到事务中
          await transactionalEntityManager.save(AnswerUser, {
            userId,
            qId,
            create_time: getTime(),
          });
        },
      );

      // 如果没有抛出异常，表示保存成功
      return { code: 0, info: '保存成功' };
    } catch (error) {
      // 如果抛出异常，表示保存失败
      console.error(error);

      return { code: -1, message: '保存失败' };
    }
  }

  async getSubmitListService({
    qId,
    page,
    pageSize,
  }): Promise<ServiceReturnType> {
    try {
      // 使用 TypeORM 的查询构建器进行连表查询
      const [data, total] = await this.answerUserRepository
        .createQueryBuilder('answer')
        .innerJoinAndSelect('answer.user', 'user')
        .where('answer.qId = :qId', { qId })
        .skip(page ? (page - 1) * pageSize : 0)
        .take(pageSize)
        .getManyAndCount();

      const totalPages = Math.ceil(total / pageSize);
      const currentPage = page || 1;
      const count = data.length; // 实际上并不是数组的长度，而是实体对象的数量
      console.log('data:', data);

      return { code: 0, info: { data, total, totalPages, currentPage, count } };
    } catch (error) {
      console.error(error);
      return { code: -1, info: '查询失败' };
    }
  }
}
