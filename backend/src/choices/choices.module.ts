import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Choice } from './entities/choice.entity.js';
import { ChoicesRepository } from './choices.repository.js';
import { ChoicesService } from './choices.service.js';
import { ChoicesController } from './choices.controller.js';
import { QuestionsModule } from '../questions/questions.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Choice]), QuestionsModule],
  controllers: [ChoicesController],
  providers: [ChoicesRepository, ChoicesService],
  exports: [ChoicesService],
})
export class ChoicesModule {}
