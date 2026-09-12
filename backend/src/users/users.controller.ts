import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UpdateRoleDto } from './dto/update-role.dto.js';
import { AttemptsService } from '../attempts/attempts.service.js';
import { Public } from '../auth/decorators/public.decorator.js';
import { AdminOnly } from '../auth/decorators/admin-only.decorator.js';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly attemptsService: AttemptsService,
  ) {}

  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @AdminOnly()
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @AdminOnly()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @AdminOnly()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @AdminOnly()
  @Patch(':id/role')
  updateRole(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.usersService.updateRole(id, updateRoleDto);
  }

  @AdminOnly()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Get(':id/attempts')
  findAttempts(@Param('id') id: string) {
    return this.attemptsService.findByUser(id);
  }

  @Get(':id/quizzes')
  findQuizzesTaken(@Param('id') id: string) {
    return this.attemptsService.findQuizzesByUser(id);
  }
}
