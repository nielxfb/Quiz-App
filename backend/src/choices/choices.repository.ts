import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Choice } from './entities/choice.entity.js';

@Injectable()
export class ChoicesRepository {
  constructor(
    @InjectRepository(Choice)
    private readonly repository: Repository<Choice>,
  ) {}

  create(data: DeepPartial<Choice>): Promise<Choice> {
    return this.repository.save(this.repository.create(data));
  }

  findAllByQuestion(questionId: string): Promise<Choice[]> {
    return this.repository.find({ where: { question: { id: questionId } } });
  }

  findById(id: string): Promise<Choice | null> {
    return this.repository.findOne({ where: { id }, relations: { question: true } });
  }

  async update(id: string, data: Partial<Choice>): Promise<Choice | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
