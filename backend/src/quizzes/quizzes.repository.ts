import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from './entities/quiz.entity.js';

@Injectable()
export class QuizzesRepository {
  constructor(
    @InjectRepository(Quiz)
    private readonly repository: Repository<Quiz>,
  ) {}

  create(data: Partial<Quiz>): Promise<Quiz> {
    return this.repository.save(this.repository.create(data));
  }

  findAll(): Promise<Quiz[]> {
    return this.repository.find();
  }

  findById(id: string): Promise<Quiz | null> {
    return this.repository.findOneBy({ id });
  }

  async update(id: string, data: Partial<Quiz>): Promise<Quiz | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
