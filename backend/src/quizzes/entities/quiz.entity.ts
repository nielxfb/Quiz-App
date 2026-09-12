import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { Question } from '../../questions/entities/question.entity.js';
import { Attempt } from '../../attempts/entities/attempt.entity.js';

@Entity()
export class Quiz {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => Question, (question) => question.quiz)
  questions: Relation<Question[]>;

  @OneToMany(() => Attempt, (attempt) => attempt.quiz)
  attempts: Relation<Attempt[]>;

  @Column({ type: 'timestamptz', default: () => 'now()' })
  createdAt: Date;
}
