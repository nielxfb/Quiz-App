import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { Quiz } from '../../quizzes/entities/quiz.entity.js';
import { AttemptAnswer } from './attempt-answer.entity.js';

@Entity()
export class Attempt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.attempts, { onDelete: 'CASCADE' })
  user: Relation<User>;

  @ManyToOne(() => Quiz, (quiz) => quiz.attempts, { onDelete: 'CASCADE' })
  quiz: Relation<Quiz>;

  @Column({ default: 0 })
  score: number;

  @OneToMany(() => AttemptAnswer, (answer) => answer.attempt)
  answers: Relation<AttemptAnswer[]>;

  @Column({ type: 'timestamptz', default: () => 'now()' })
  submittedAt: Date;
}
