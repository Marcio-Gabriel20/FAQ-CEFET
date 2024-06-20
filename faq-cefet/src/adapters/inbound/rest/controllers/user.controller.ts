import { Body, Controller, Get, Param, Post, Put, UseGuards, UseInterceptors } from "@nestjs/common";
import { CreateUserUseCase } from "src/core/use-cases/user/create-user.use-case";
import { GetUserUseCase } from "src/core/use-cases/user/get-user.use-case";
import { CreateUserDto } from "../dto/create-user.dto";
import { LoggingInterceptor } from "../interceptors/logging.interceptor";
import { ResponseInterceptor } from "../interceptors/response.interceptor";

@Controller('users')
@UseInterceptors(LoggingInterceptor, ResponseInterceptor)
export class UserController {
    constructor(
        private readonly createUserUseCase: CreateUserUseCase,
        private readonly getUserUseCase: GetUserUseCase,
    ) {}

    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        return this.createUserUseCase.execute(createUserDto.username, createUserDto.password);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.getUserUseCase.execute(id);
    }
}