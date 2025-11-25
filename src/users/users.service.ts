import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import type { UserRole } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async create(data: { email: string; passwordHash: string; role?: UserRole }) {
    const user = this.usersRepository.create({
      email: data.email,
      passwordHash: data.passwordHash,
      role: data.role || 'user',
    });

    return this.usersRepository.save(user);
  }
}
