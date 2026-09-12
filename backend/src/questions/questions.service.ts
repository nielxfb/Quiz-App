import { Injectable, NotFoundException } from '@nestjs/common';
import { QuestionsRepository } from './questions.repository.js';
import { CreateQuestionDto } from './dto/create-question.dto.js';
import { UpdateQuestionDto } from './dto/update-question.dto.js';
import { Question } from './entities/question.entity.js';
import { QuizzesService } from '../quizzes/quizzes.service.js';

@Injectable()
export class QuestionsService {
  constructor(
    private readonly questionsRepository: QuestionsRepository,
    private readonly quizzesService: QuizzesService,
  ) {}

  async create(quizId: string, createQuestionDto: CreateQuestionDto): Promise<Question> {
    await this.quizzesService.findOne(quizId);
    return this.questionsRepository.create({ ...createQuestionDto, quiz: { id: quizId } });
  }

  async findAllByQuiz(quizId: string): Promise<Question[]> {
    await this.quizzesService.findOne(quizId);
    return this.questionsRepository.findAllByQuiz(quizId);
  }

  async findOne(id: string): Promise<Question> {
    const question = await this.questionsRepository.findById(id);
    if (!question) {
      throw new NotFoundException(`Question ${id} not found`);
    }
    return question;
  }

  async update(id: string, updateQuestionDto: UpdateQuestionDto): Promise<Question> {
    await this.findOne(id);
    return (await this.questionsRepository.update(id, updateQuestionDto))!;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.questionsRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Question ${id} not found`);
    }
  }
}
