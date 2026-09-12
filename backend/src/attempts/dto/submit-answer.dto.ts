import { IsUUID } from 'class-validator';

export class SubmitAnswerDto {
  @IsUUID()
  questionId: string;

  @IsUUID()
  choiceId: string;
}
