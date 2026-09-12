import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AttemptsService } from './attempts.service.js';
import { StartAttemptDto } from './dto/start-attempt.dto.js';
import { SubmitAnswerDto } from './dto/submit-answer.dto.js';

@ApiTags('attempts')
@Controller()
export class AttemptsController {
  constructor(private readonly attemptsService: AttemptsService) {}

  @Post('quizzes/:quizId/attempts')
  start(@Param('quizId') quizId: string, @Body() startAttemptDto: StartAttemptDto) {
    return this.attemptsService.start(quizId, startAttemptDto);
  }

  @Get('quizzes/:quizId/attempts')
  findAllForQuiz(@Param('quizId') quizId: string) {
    return this.attemptsService.findByQuiz(quizId);
  }

  @Get('attempts')
  findAll(@Query('quizId') quizId?: string, @Query('userId') userId?: string) {
    if (quizId) {
      return this.attemptsService.findByQuiz(quizId);
    }
    if (userId) {
      return this.attemptsService.findByUser(userId);
    }
    return [];
  }

  @Get('attempts/:id')
  findOne(@Param('id') id: string) {
    return this.attemptsService.findOne(id);
  }

  @Post('attempts/:id/answers')
  submitAnswer(@Param('id') id: string, @Body() submitAnswerDto: SubmitAnswerDto) {
    return this.attemptsService.submitAnswer(id, submitAnswerDto);
  }

  @Post('attempts/:id/submit')
  submit(@Param('id') id: string) {
    return this.attemptsService.submit(id);
  }

  @Delete('attempts/:id')
  remove(@Param('id') id: string) {
    return this.attemptsService.remove(id);
  }
}
