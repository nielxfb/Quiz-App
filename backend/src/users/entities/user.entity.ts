import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Attempt } from '../../attempts/entities/attempt.entity.js';
import { UserRole } from './user-role.enum.js';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column({ select: false })
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @OneToMany(() => Attempt, (attempt) => attempt.user)
  attempts: Relation<Attempt[]>;

  @Column({ type: 'timestamptz', default: () => 'now()' })
  createdAt: Date;
}
