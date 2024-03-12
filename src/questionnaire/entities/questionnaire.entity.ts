import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from './question.entity';
import { AnswerUser } from 'src/answer/entities/answerUser.entity';

@Entity()
export class Questionnaire {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  isPublished: number;

  @Column()
  isDeleted: number;

  @Column()
  create_time: string;

  @Column()
  creatorId: string | number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'creatorId' })
  creator: User;

  @OneToMany(()=>Question,question=>question.questionnaire)
  questions:Question[]

  @OneToMany(() => AnswerUser, answerUser => answerUser.questionnaire)
  answerUsers: AnswerUser[];
}
