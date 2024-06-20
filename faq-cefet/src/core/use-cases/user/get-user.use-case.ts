import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from 'src/core/domain/entities/user.entity';

@Injectable()
export class GetUserUseCase {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(id: string): Promise<User> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
}
