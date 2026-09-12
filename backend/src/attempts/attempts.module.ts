import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attempt } from './entities/attempt.entity.js';
import { AttemptAnswer } from './entities/attempt-answer.entity.js';
import { AttemptsRepository } from './attempts.repository.js';
import { AttemptsService } from './attempts.service.js';
import { AttemptsController } from './attempts.controller.js';
import { QuizzesModule } from '../quizzes/quizzes.module.js';
import { ChoicesModule } from '../choices/choices.module.js';
import { UsersModule } from '../users/users.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attempt, AttemptAnswer]),
    QuizzesModule,
    ChoicesModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [AttemptsController],
  providers: [AttemptsRepository, AttemptsService],
  exports: [AttemptsService],
})
export class AttemptsModule {}
