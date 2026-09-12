import { Injectable, NotFoundException } from '@nestjs/common';
import { QuizzesRepository } from './quizzes.repository.js';
import { CreateQuizDto } from './dto/create-quiz.dto.js';
import { UpdateQuizDto } from './dto/update-quiz.dto.js';
import { Quiz } from './entities/quiz.entity.js';

@Injectable()
export class QuizzesService {
  constructor(private readonly quizzesRepository: QuizzesRepository) {}

  create(createQuizDto: CreateQuizDto): Promise<Quiz> {
    return this.quizzesRepository.create(createQuizDto);
  }

  findAll(): Promise<Quiz[]> {
    return this.quizzesRepository.findAll();
  }

  async findOne(id: string): Promise<Quiz> {
    const quiz = await this.quizzesRepository.findById(id);
    if (!quiz) {
      throw new NotFoundException(`Quiz ${id} not found`);
    }
    return quiz;
  }

  async update(id: string, updateQuizDto: UpdateQuizDto): Promise<Quiz> {
    await this.findOne(id);
    return (await this.quizzesRepository.update(id, updateQuizDto))!;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.quizzesRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Quiz ${id} not found`);
    }
  }
}
