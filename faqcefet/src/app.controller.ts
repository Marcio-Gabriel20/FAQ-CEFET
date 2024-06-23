import { Controller, Get, UseFilters } from '@nestjs/common';
import { AppService } from './app.service';
import { IsPublic } from './auth/decorator/is-public.decorator';
import { CurrentUser } from './auth/decorator/current-user.decorator';
import { User } from './user/entity/user.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthExceptionFilter } from './auth/exception/auth.exception';

@Controller()
@UseFilters(AuthExceptionFilter)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @IsPublic()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiTags('user')
  @ApiBearerAuth()
  @Get('me')
  getMe(@CurrentUser() user: User) {
    return user;
  }
}
