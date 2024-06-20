// src/core/use-cases/user/create-user.use-case.ts
import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreateUserUseCase {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(username: string, password: string): Promise<User> {
        const hashedPassword = bcrypt.hashSync(password, 10);
        const user = new User(uuidv4(), username, hashedPassword);
        return this.userRepository.save(user);
    }
}