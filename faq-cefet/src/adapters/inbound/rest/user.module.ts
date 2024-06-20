import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserOrmEntity } from "src/adapters/outbound/persistence/user/user-orm-entity";
import { UserController } from "./controllers/user.controller";
import { TypeOrmUserRepository } from "src/adapters/outbound/persistence/user/typeorm-user.repository";
import { CreateUserUseCase } from "src/core/use-cases/user/create-user.use-case";
import { GetUserUseCase } from "src/core/use-cases/user/get-user.use-case";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserOrmEntity])
    ],
    controllers: [UserController],
    providers: [
        TypeOrmUserRepository,
        CreateUserUseCase,
        GetUserUseCase,
    ],
})
export class UserModule {}