import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { Quiz } from '../../quizzes/entities/quiz.entity.js';
import { Choice } from '../../choices/entities/choice.entity.js';

@Entity()
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  text: string;

  @ManyToOne(() => Quiz, (quiz) => quiz.questions, { onDelete: 'CASCADE' })
  quiz: Relation<Quiz>;

  @OneToMany(() => Choice, (choice) => choice.question)
  choices: Relation<Choice[]>;
}
