import { User } from '../entity/user.entity';
import { IsEmail, IsEnum, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Role } from '../enum/role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto extends User {
    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'password too weak',
    })
    password: string;

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsEnum(Role)
    role: Role;
}