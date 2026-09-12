import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateChoiceDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsBoolean()
  @IsOptional()
  isCorrect?: boolean;
}
