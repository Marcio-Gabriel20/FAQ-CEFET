import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";

@ApiExtraModels()
export class CreateUserRequestBody {
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsEnum(Role)
    @IsNotEmpty()
    role: Role;
}