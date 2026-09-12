import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChoicesService } from './choices.service.js';
import { CreateChoiceDto } from './dto/create-choice.dto.js';
import { UpdateChoiceDto } from './dto/update-choice.dto.js';
import { AdminOnly } from '../auth/decorators/admin-only.decorator.js';

@ApiTags('choices')
@Controller()
export class ChoicesController {
  constructor(private readonly choicesService: ChoicesService) {}

  @AdminOnly()
  @Post('questions/:questionId/choices')
  create(@Param('questionId') questionId: string, @Body() createChoiceDto: CreateChoiceDto) {
    return this.choicesService.create(questionId, createChoiceDto);
  }

  @Get('questions/:questionId/choices')
  findAllForQuestion(@Param('questionId') questionId: string) {
    return this.choicesService.findAllByQuestion(questionId);
  }

  @Get('choices/:id')
  findOne(@Param('id') id: string) {
    return this.choicesService.findOne(id);
  }

  @AdminOnly()
  @Patch('choices/:id')
  update(@Param('id') id: string, @Body() updateChoiceDto: UpdateChoiceDto) {
    return this.choicesService.update(id, updateChoiceDto);
  }

  @AdminOnly()
  @Delete('choices/:id')
  remove(@Param('id') id: string) {
    return this.choicesService.remove(id);
  }
}
