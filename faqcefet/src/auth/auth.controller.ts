import { Controller, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { AuthRequest } from './model/AuthRequest';
import { IsPublic } from './decorator/is-public.decorator';

@Controller()
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @IsPublic()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalAuthGuard)
    login(@Request() req: AuthRequest) {
        console.log(req.user);

        return this.authService.login(req.user);
    }
}
