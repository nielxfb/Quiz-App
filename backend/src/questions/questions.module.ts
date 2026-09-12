import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity.js';
import { QuestionsRepository } from './questions.repository.js';
import { QuestionsService } from './questions.service.js';
import { QuestionsController } from './questions.controller.js';
import { QuizzesModule } from '../quizzes/quizzes.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Question]), QuizzesModule],
  controllers: [QuestionsController],
  providers: [QuestionsRepository, QuestionsService],
  exports: [QuestionsService],
})
export class QuestionsModule {}
