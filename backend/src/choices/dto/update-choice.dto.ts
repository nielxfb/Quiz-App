import { PartialType } from '@nestjs/mapped-types';
import { CreateChoiceDto } from './create-choice.dto.js';

export class UpdateChoiceDto extends PartialType(CreateChoiceDto) {}
