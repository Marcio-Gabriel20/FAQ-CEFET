import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { UnauthorizedError } from './error/unauthorized.error';
import { UserPayload } from './model/UserPayload';
import { UserToken } from './model/UserToken';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

    login(user: User): UserToken {
        const payload: UserPayload = {
            sub: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        };

        const jwtToken = this.jwtService.sign(payload);

        return {
            access_token: jwtToken,
        };
    }

    async validateUser(email: string, password: string) {
        const user = await this.userService.findByEmail(email);

        if(user) {  
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if(isPasswordValid) {
                return {
                    ...user,
                    password: undefined,
                };
            }
        }

        throw new UnauthorizedError('Email address or password provided is incorrect.')
    }

}
