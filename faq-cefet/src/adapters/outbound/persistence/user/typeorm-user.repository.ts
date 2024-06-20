import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "src/core/domain/repositories/user.repository";
import { UserOrmEntity } from "../user/user-orm-entity";
import { Repository } from "typeorm";
import { User } from "src/core/domain/entities/user.entity";

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
    constructor(
        @InjectRepository(UserOrmEntity)
        private readonly repository: Repository<UserOrmEntity>,
    ) {}

    async save(user: User): Promise<User> {
        const userEntity = this.repository.create(user);
        await this.repository.save(userEntity);
        return userEntity;
    }

    async findById(id: string): Promise<User | null> {
        const user = await this.repository.findOne({ where: { id } });
        if(!user) {
            return null;
        }
        return user;
    }

    async findAll(): Promise<User[]> {
        return this.repository.find();
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}