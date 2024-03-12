import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Answer } from './answer.entity';
import { Questionnaire } from 'src/questionnaire/entities/questionnaire.entity';

@Entity()
export class AnswerUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  qId: number;

  @Column()
  create_time: string;

  @ManyToOne(() => User, (user) => user.answerUsers) // 定义与 User 实体的关联
  user: User; // 添加该属性，用于保存与 User 实体的关联

  @OneToMany(() => Answer, (answer) => answer.user)
  answers: Answer[];

  @ManyToOne(
    () => Questionnaire,
    (questionnaire) => questionnaire.answerUsers,
    { cascade: ['remove'] },
  )
  questionnaire: Questionnaire;
}
