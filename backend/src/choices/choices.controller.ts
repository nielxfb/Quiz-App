import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChoicesService } from './choices.service.js';
import { CreateChoiceDto } from './dto/create-choice.dto.js';
import { UpdateChoiceDto } from './dto/update-choice.dto.js';

@ApiTags('choices')
@Controller()
export class ChoicesController {
  constructor(private readonly choicesService: ChoicesService) {}

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

  @Patch('choices/:id')
  update(@Param('id') id: string, @Body() updateChoiceDto: UpdateChoiceDto) {
    return this.choicesService.update(id, updateChoiceDto);
  }

  @Delete('choices/:id')
  remove(@Param('id') id: string) {
    return this.choicesService.remove(id);
  }
}
