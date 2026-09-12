import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Question } from './entities/question.entity.js';

@Injectable()
export class QuestionsRepository {
  constructor(
    @InjectRepository(Question)
    private readonly repository: Repository<Question>,
  ) {}

  create(data: DeepPartial<Question>): Promise<Question> {
    return this.repository.save(this.repository.create(data));
  }

  findAllByQuiz(quizId: string): Promise<Question[]> {
    return this.repository.find({ where: { quiz: { id: quizId } }, relations: { choices: true } });
  }

  findById(id: string): Promise<Question | null> {
    return this.repository.findOne({ where: { id }, relations: { choices: true, quiz: true } });
  }

  async update(id: string, data: Partial<Question>): Promise<Question | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
