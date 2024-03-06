import { Question } from 'src/questionnaire/entities/question.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Answer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  questionId: number;

  @Column()
  answer: string;

  @Column()
  create_time: string;

  @ManyToOne(() => Question, { onDelete: 'CASCADE' })
  question: Question;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;
}
