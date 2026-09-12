import { IsOptional, IsUUID } from 'class-validator';

export class StartAttemptDto {
  @IsUUID()
  @IsOptional()
  userId?: string;
}
