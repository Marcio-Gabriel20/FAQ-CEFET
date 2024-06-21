import { Controller, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { IsPublic } from './decorator/is-public.decorator';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { AuthRequest } from './model/AuthRequest';
import { LoginRequestBody } from './model/LoginRequestBody';

@ApiTags('auth')
@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @IsPublic()
    @Post('login')
    @ApiBody({ type: LoginRequestBody })
    @ApiResponse({
        status: 200,
        description: 'Successful login',
        schema: {
            type: 'object',
            properties: {
                access_token: { type: 'string' },
            },
        },
    })
    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalAuthGuard)
    login(@Request() req: AuthRequest) {
        return this.authService.login(req.user);
    }
}
