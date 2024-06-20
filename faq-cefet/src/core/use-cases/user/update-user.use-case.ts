import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from 'src/core/domain/entities/user.entity';

@Injectable()
export class UpdateUserUseCase {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(id: string, username: string, password: string): Promise<User> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        user.username = username;
        user.password = password;
        return this.userRepository.save(user);
    }
}
