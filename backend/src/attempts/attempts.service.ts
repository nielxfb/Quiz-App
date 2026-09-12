import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AttemptsRepository } from './attempts.repository.js';
import { SubmitAnswerDto } from './dto/submit-answer.dto.js';
import { Attempt } from './entities/attempt.entity.js';
import { AttemptAnswer } from './entities/attempt-answer.entity.js';
import { Quiz } from '../quizzes/entities/quiz.entity.js';
import { QuizzesService } from '../quizzes/quizzes.service.js';
import { ChoicesService } from '../choices/choices.service.js';

@Injectable()
export class AttemptsService {
  constructor(
    private readonly attemptsRepository: AttemptsRepository,
    private readonly quizzesService: QuizzesService,
    private readonly choicesService: ChoicesService,
  ) {}

  async start(quizId: string, userId: string): Promise<Attempt> {
    await this.quizzesService.findOne(quizId);
    return this.attemptsRepository.create({
      quiz: { id: quizId },
      user: { id: userId },
    });
  }

  async findOne(id: string): Promise<Attempt> {
    const attempt = await this.attemptsRepository.findById(id);
    if (!attempt) {
      throw new NotFoundException(`Attempt ${id} not found`);
    }
    return attempt;
  }

  findByQuiz(quizId: string): Promise<Attempt[]> {
    return this.attemptsRepository.findAll({ quizId });
  }

  findByUser(userId: string): Promise<Attempt[]> {
    return this.attemptsRepository.findAll({ userId });
  }

  async findQuizzesByUser(userId: string): Promise<Quiz[]> {
    const attempts = await this.attemptsRepository.findAll({ userId });
    const quizzesById = new Map<string, Quiz>();
    for (const attempt of attempts) {
      quizzesById.set(attempt.quiz.id, attempt.quiz);
    }
    return [...quizzesById.values()];
  }

  async submitAnswer(
    attemptId: string,
    submitAnswerDto: SubmitAnswerDto,
  ): Promise<AttemptAnswer> {
    await this.findOne(attemptId);
    const choice = await this.choicesService.findOne(submitAnswerDto.choiceId);
    if (choice.question.id !== submitAnswerDto.questionId) {
      throw new BadRequestException('Choice does not belong to the given question');
    }

    const existing = await this.attemptsRepository.findAnswer(
      attemptId,
      submitAnswerDto.questionId,
    );
    return this.attemptsRepository.saveAnswer({
      id: existing?.id,
      attempt: { id: attemptId },
      question: { id: submitAnswerDto.questionId },
      selectedChoice: { id: submitAnswerDto.choiceId },
    });
  }

  async submit(attemptId: string): Promise<Attempt> {
    await this.findOne(attemptId);
    const score = await this.attemptsRepository.countCorrectAnswers(attemptId);
    return (await this.attemptsRepository.updateScore(attemptId, score))!;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.attemptsRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Attempt ${id} not found`);
    }
  }
}
