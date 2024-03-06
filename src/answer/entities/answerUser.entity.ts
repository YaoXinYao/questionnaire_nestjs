import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
}
