import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';

@Injectable()
export class DeleteUserUseCase {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(id: string): Promise<void> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        await this.userRepository.delete(id);
    }
}
