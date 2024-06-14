import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Answer } from './entities/answer.entity';
import { EntityManager, Raw, Repository } from 'typeorm';
import { Question } from 'src/questionnaire/entities/question.entity';
import { ServiceReturnType } from 'src/type/service';
import { getTime } from 'src/publicMethods/userMethods';
import { AnswerUser } from './entities/answerUser.entity';
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
    try {
      let questionInfo = await this.questionRepository.findOneBy({
        id: questionId,
      });
      const CHOOSETYPE = ['questionRadio', 'questionCheckbox'];
      let num: number = 0;
      if (questionInfo) {
        let { type } = questionInfo;
        if (type == CHOOSETYPE[0]) {
          let statRes = await this.answerRepository.findAndCountBy({
            questionId,
            answer: answerKey,
          });

          return { code: 0, info: statRes[1] };
        }
        if (type === CHOOSETYPE[1]) {
          const statRes = await this.answerRepository.findBy({
            questionId,
          });

          for (let i = 0; i < statRes.length; i++) {
            const { answer } = statRes[i];
            const answerArray = JSON.parse(answer);

            if (Array.isArray(answerArray) && answerArray.includes(answerKey)) {
              num++;
            }
          }

          return { code: 0, info: num };
        }
      }

      return { code: -1, info: '查询失败' };
    } catch (error) {
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
    searchKey,
  }): Promise<ServiceReturnType> {
    try {
      const queryBuilder = this.answerUserRepository
        .createQueryBuilder('answerUser')
        .leftJoinAndSelect('answerUser.user', 'user')
        .leftJoinAndSelect('answerUser.answers', 'answer')
        .where('answerUser.qId = :qId', { qId });

      if (searchKey) {
        queryBuilder.andWhere(
          '(user.username LIKE :searchKey OR user.email LIKE :searchKey)',
          {
            searchKey: `%${searchKey}%`,
          },
        );
      }

      const [data, total] = await queryBuilder
        .skip(page ? (page - 1) * pageSize : 0)
        .take(pageSize)
        .getManyAndCount();

      const totalPages = Math.ceil(total / pageSize);
      const currentPage = page || 1;
      const count = data.length;
      return {
        code: 0,
        info: { data, total, totalPages, currentPage, count },
      };
    } catch (error) {
      console.error(error);
      return { code: -1, info: '查询失败' };
    }
  }

  // async getSubmitListService({
  //   qId,
  //   page,
  //   pageSize,
  //   searchKey,
  // }): Promise<ServiceReturnType> {
  //   try {
  //     const res = await this.answerRepository.find({
  //       where: {
  //         answer: Like(`%${searchKey}%`),
  //       },
  //     });
  //     console.log(res);

  //     return { code: 0, info: res };
  //   } catch (error) {
  //     console.error(error);
  //     return { code: -1, info: '查询失败' };
  //   }
  // }

  async getUserAnswerService(userId: number, questionnaireId: number) {
    try {
      const answers = await this.answerRepository
        .createQueryBuilder('answer')
        .innerJoinAndSelect('answer.question', 'question')
        .where('answer.userId = :userId', { userId })
        .andWhere('question.qId = :questionnaireId', { questionnaireId })
        .orderBy('question.indexId', 'ASC')
        .getMany();

      return { code: 0, info: answers };
    } catch (error) {
      console.error(error);
      return { code: -1, info: '查询失败' };
    }
  }
}
