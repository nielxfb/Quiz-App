import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { Attempt } from './attempt.entity.js';
import { Question } from '../../questions/entities/question.entity.js';
import { Choice } from '../../choices/entities/choice.entity.js';

@Entity()
export class AttemptAnswer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Attempt, (attempt) => attempt.answers, { onDelete: 'CASCADE' })
  attempt: Relation<Attempt>;

  @ManyToOne(() => Question, { onDelete: 'CASCADE' })
  question: Relation<Question>;

  @ManyToOne(() => Choice, { onDelete: 'CASCADE' })
  selectedChoice: Relation<Choice>;
}
