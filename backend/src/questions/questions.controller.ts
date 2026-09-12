import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { QuestionsService } from './questions.service.js';
import { CreateQuestionDto } from './dto/create-question.dto.js';
import { UpdateQuestionDto } from './dto/update-question.dto.js';
import { AdminOnly } from '../auth/decorators/admin-only.decorator.js';

@ApiTags('questions')
@Controller()
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @AdminOnly()
  @Post('quizzes/:quizId/questions')
  create(@Param('quizId') quizId: string, @Body() createQuestionDto: CreateQuestionDto) {
    return this.questionsService.create(quizId, createQuestionDto);
  }

  @Get('quizzes/:quizId/questions')
  findAllForQuiz(@Param('quizId') quizId: string) {
    return this.questionsService.findAllByQuiz(quizId);
  }

  @Get('questions/:id')
  findOne(@Param('id') id: string) {
    return this.questionsService.findOne(id);
  }

  @AdminOnly()
  @Patch('questions/:id')
  update(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDto) {
    return this.questionsService.update(id, updateQuestionDto);
  }

  @AdminOnly()
  @Delete('questions/:id')
  remove(@Param('id') id: string) {
    return this.questionsService.remove(id);
  }
}
