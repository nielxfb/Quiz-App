import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { QuestionsService } from './questions.service.js';
import { CreateQuestionDto } from './dto/create-question.dto.js';
import { UpdateQuestionDto } from './dto/update-question.dto.js';

@Controller()
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

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

  @Patch('questions/:id')
  update(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDto) {
    return this.questionsService.update(id, updateQuestionDto);
  }

  @Delete('questions/:id')
  remove(@Param('id') id: string) {
    return this.questionsService.remove(id);
  }
}
