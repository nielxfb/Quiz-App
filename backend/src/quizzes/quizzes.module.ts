import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from './entities/quiz.entity.js';
import { QuizzesRepository } from './quizzes.repository.js';
import { QuizzesService } from './quizzes.service.js';
import { QuizzesController } from './quizzes.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Quiz])],
  controllers: [QuizzesController],
  providers: [QuizzesRepository, QuizzesService],
  exports: [QuizzesService],
})
export class QuizzesModule {}
