import { Injectable } from '@nestjs/common';
import { CreateQuestionnaireDto } from './dto/create-questionnaire.dto';
import { UpdateQuestionnaireDto } from './dto/update-questionnaire.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Questionnaire } from './entities/questionnaire.entity';
import { ILike, Repository } from 'typeorm';
import { getTime } from 'src/publicMethods/userMethods';
import { AddQuestionDto } from './dto/add-question.dto';
import { Question } from './entities/question.entity';
import { ServiceReturnType } from 'src/type/service';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class QuestionnaireService {
  constructor(
    @InjectRepository(Questionnaire)
    private questionnaireRepository: Repository<Questionnaire>,

    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}

  async create(createQuestionnaireDto: CreateQuestionnaireDto) {
    try {
      const res = await this.questionnaireRepository.save({
        ...createQuestionnaireDto,
        create_time: getTime(),
      });

      return { code: 0, info: res };
    } catch (error) {
      console.error('创建失败', error);
      return { code: -1, info: '创建失败' };
    }
  }

  async findByUserId(id: number): Promise<ServiceReturnType> {
    try {
      const res = await this.questionnaireRepository.findBy({ creatorId: id });
      return { code: 0, info: res };
    } catch (error) {
      console.error('查询失败', error);
      return { code: -1, info: '查询失败' };
    }
  }

  async find(
    id: number,
    title?: string,
    isPublished?: number,
    isDeleted?: number,
    creatorId?: number,
    page?: number,
    pageSize?: number,
  ): Promise<ServiceReturnType> {
    try {
      const [data, total] = await this.questionnaireRepository.findAndCount({
        where: {
          id,
          title: title ? ILike(`%${title}%`) : undefined, // 模糊查询
          isPublished,
          isDeleted,
          creatorId,
        },
        skip: (page - 1) * pageSize, // 计算跳过的记录数
        take: pageSize, // 每页记录数
        order: { id: 'DESC' }, // 按 id 逆序排序
      });

      const totalPages = Math.ceil(total / pageSize); // 计算总页数
      const currentPage = page; // 当前页数
      const count = data.length; // 结果数组的长度

      return {
        code: 0,
        info: {
          data,
          total,
          totalPages,
          currentPage,
          count,
        },
      };
    } catch (error) {
      console.error('查询失败', error);
      return { code: -1, info: '查询失败' };
    }
  }

  async getQuestionnaireInfo(id: number): Promise<ServiceReturnType> {
    try {
      let questionnaireRes = await this.questionnaireRepository.findBy({ id });
      let questionRes = await this.questionRepository.findBy({ qId: id });
      questionRes.sort((a, b) => a.indexId - b.indexId);

      return {
        code: 0,
        info: { ...questionnaireRes[0], componentList: questionRes },
      };
    } catch (error) {
      console.error('查询失败', error);
      return { code: -1, info: '查询失败' };
    }
  }

  async addQuestionItems(
    addQuestionDto: Array<AddQuestionDto>,
  ): Promise<ServiceReturnType> {
    try {
      let resArr = [];
      for (let i = 0; i < addQuestionDto.length; i++) {
        const res = await this.questionRepository.save({
          ...addQuestionDto[i],
          create_time: getTime(),
        });

        resArr.push(res);
      }

      return { code: 0, info: resArr };
    } catch (error) {
      console.error('添加失败', error);
      return { code: -1, info: '添加失败' };
    }
  }

  async updateQuestionItem(
    updateQuestionDto: Array<UpdateQuestionDto>,
  ): Promise<ServiceReturnType> {
    try {
      for (let i = 0; i < updateQuestionDto.length; i++) {
        let { id, ...props } = updateQuestionDto[i];
        const res = await this.questionRepository.update(id, {
          ...props,
          create_time: getTime(),
        });
      }

      return { code: 0, info: '更新成功' };
    } catch (error) {
      console.error('更新失败', error);
      return { code: -1, info: '更新失败' };
    }
  }

  async deleteQuestionItems(ids: number[]): Promise<ServiceReturnType> {
    try {
      const res = await this.questionRepository.delete(ids);

      if (res.affected > 0) {
        return { code: 0, info: '删除成功' };
      }
    } catch (error) {
      console.error(error);
      return {
        code: -1,
        info: '删除失败',
      };
    }
  }

  async updateQuestionItemIndex(
    indexArr: Array<number>,
  ): Promise<ServiceReturnType> {
    try {
      for (let i = 0; i < indexArr.length; i++) {
        await this.questionRepository.update(indexArr[i], { indexId: i });
      }
      return { code: 0, info: '修改成功' };
    } catch (error) {
      console.error(error);
      return {
        code: -1,
        info: '修改失败',
      };
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} questionnaire`;
  }

  async update(
    updateQuestionnaireDto: UpdateQuestionnaireDto,
  ): Promise<ServiceReturnType> {
    try {
      let { id, ...props } = updateQuestionnaireDto;

      const res = await this.questionnaireRepository.update(id, props);

      if (res.affected == 1) {
        return { code: 0, info: '修改成功' };
      } else {
        return { code: -1, info: '修改失败' };
      }
    } catch (error) {
      console.error('查询失败', error);
      return { code: -1, info: '修改失败' };
    }
  }

  async remove(ids: number[]): Promise<ServiceReturnType> {
    try {
      const res = await this.questionnaireRepository.delete(ids);

      if (res.affected > 0) {
        return { code: 0, info: '修改成功' };
      } else {
        return { code: -1, info: '修改失败' };
      }
    } catch (error) {
      console.error('删除失败', error);
      return { code: -1, info: '删除失败' };
    }
  }
}
