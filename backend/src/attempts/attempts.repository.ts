import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Attempt } from './entities/attempt.entity.js';
import { AttemptAnswer } from './entities/attempt-answer.entity.js';

@Injectable()
export class AttemptsRepository {
  constructor(
    @InjectRepository(Attempt)
    private readonly attemptRepository: Repository<Attempt>,
    @InjectRepository(AttemptAnswer)
    private readonly attemptAnswerRepository: Repository<AttemptAnswer>,
  ) {}

  create(data: DeepPartial<Attempt>): Promise<Attempt> {
    return this.attemptRepository.save(this.attemptRepository.create(data));
  }

  findById(id: string): Promise<Attempt | null> {
    return this.attemptRepository.findOne({
      where: { id },
      relations: { user: true, quiz: true, answers: { question: true, selectedChoice: true } },
    });
  }

  findAll(where: { quizId?: string; userId?: string }): Promise<Attempt[]> {
    return this.attemptRepository.find({
      where: {
        ...(where.quizId && { quiz: { id: where.quizId } }),
        ...(where.userId && { user: { id: where.userId } }),
      },
      relations: { user: true, quiz: true },
    });
  }

  async updateScore(id: string, score: number): Promise<Attempt | null> {
    await this.attemptRepository.update(id, { score });
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.attemptRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  findAnswer(attemptId: string, questionId: string): Promise<AttemptAnswer | null> {
    return this.attemptAnswerRepository.findOne({
      where: { attempt: { id: attemptId }, question: { id: questionId } },
    });
  }

  saveAnswer(data: DeepPartial<AttemptAnswer>): Promise<AttemptAnswer> {
    return this.attemptAnswerRepository.save(this.attemptAnswerRepository.create(data));
  }

  countCorrectAnswers(attemptId: string): Promise<number> {
    return this.attemptAnswerRepository
      .createQueryBuilder('answer')
      .innerJoin('answer.selectedChoice', 'choice')
      .where('answer.attemptId = :attemptId', { attemptId })
      .andWhere('choice.isCorrect = true')
      .getCount();
  }
}
