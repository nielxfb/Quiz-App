import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './users.repository.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UpdateRoleDto } from './dto/update-role.dto.js';
import { User } from './entities/user.entity.js';

const SALT_ROUNDS = 10;

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.usersRepository.findByEmail(createUserDto.email);
    if (existing) {
      throw new ConflictException(`Email ${createUserDto.email} is already registered`);
    }
    const password = await bcrypt.hash(createUserDto.password, SALT_ROUNDS);
    return this.usersRepository.create({ ...createUserDto, password });
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  findByEmailWithPassword(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  findOneOrNull(id: string): Promise<User | null> {
    return this.usersRepository.findById(id);
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    await this.findOne(id);
    const data: Partial<User> = { ...updateUserDto };
    if (updateUserDto.password) {
      data.password = await bcrypt.hash(updateUserDto.password, SALT_ROUNDS);
    }
    return (await this.usersRepository.update(id, data))!;
  }

  async updateRole(id: string, updateRoleDto: UpdateRoleDto): Promise<User> {
    await this.findOne(id);
    return (await this.usersRepository.update(id, { role: updateRoleDto.role }))!;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.usersRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`User ${id} not found`);
    }
  }
}
