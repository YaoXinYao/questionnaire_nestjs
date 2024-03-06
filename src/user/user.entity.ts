import { AnswerUser } from 'src/answer/entities/answerUser.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  create_time: string;

  @OneToMany(() => AnswerUser, (answerUser) => answerUser.user)
  answerUsers: AnswerUser[]; // 添加该属性，用于保存与 AnswerUser 实体的关联
}
