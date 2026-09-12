import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { Question } from '../../questions/entities/question.entity.js';

@Entity()
export class Choice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  text: string;

  @Column({ default: false })
  isCorrect: boolean;

  @ManyToOne(() => Question, (question) => question.choices, { onDelete: 'CASCADE' })
  question: Relation<Question>;
}
