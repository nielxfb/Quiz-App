import { Injectable, NotFoundException } from '@nestjs/common';
import { ChoicesRepository } from './choices.repository.js';
import { CreateChoiceDto } from './dto/create-choice.dto.js';
import { UpdateChoiceDto } from './dto/update-choice.dto.js';
import { Choice } from './entities/choice.entity.js';
import { QuestionsService } from '../questions/questions.service.js';

@Injectable()
export class ChoicesService {
  constructor(
    private readonly choicesRepository: ChoicesRepository,
    private readonly questionsService: QuestionsService,
  ) {}

  async create(questionId: string, createChoiceDto: CreateChoiceDto): Promise<Choice> {
    await this.questionsService.findOne(questionId);
    return this.choicesRepository.create({ ...createChoiceDto, question: { id: questionId } });
  }

  async findAllByQuestion(questionId: string): Promise<Choice[]> {
    await this.questionsService.findOne(questionId);
    return this.choicesRepository.findAllByQuestion(questionId);
  }

  async findOne(id: string): Promise<Choice> {
    const choice = await this.choicesRepository.findById(id);
    if (!choice) {
      throw new NotFoundException(`Choice ${id} not found`);
    }
    return choice;
  }

  async update(id: string, updateChoiceDto: UpdateChoiceDto): Promise<Choice> {
    await this.findOne(id);
    return (await this.choicesRepository.update(id, updateChoiceDto))!;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.choicesRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Choice ${id} not found`);
    }
  }
}
