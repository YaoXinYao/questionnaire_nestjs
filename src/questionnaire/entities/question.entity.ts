import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Questionnaire } from './questionnaire.entity';
import { Answer } from 'src/answer/entities/answer.entity';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  indexId: number;

  @Column()
  title: string;

  @Column()
  type: string;

  @Column()
  isHidden: number;

  @Column()
  isLocked: number;

  @Column()
  props: string;

  @Column()
  qId: number;

  @Column()
  create_time: string;

  @ManyToOne(() => Questionnaire, (questionnaire) => questionnaire.questions, {
    onDelete: 'CASCADE',
  })
  
  @JoinColumn({ name: 'qId' })
  questionnaire: Questionnaire;

  @OneToMany(() => Answer, answer => answer.question, { cascade: true })
  answers: Answer[];
}
 