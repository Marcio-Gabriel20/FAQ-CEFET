import { Body, Controller, Post, UseFilters, UseGuards } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsPublic } from 'src/auth/decorator/is-public.decorator';
import { AuthExceptionFilter } from 'src/auth/exception/auth.exception';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from './enum/role.enum';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  @IsPublic()
  @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.ADMINISTRATOR)
  @UseFilters(AuthExceptionFilter)
  @Post()
  // @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        password: { type: 'string' },
        name: { type: 'string' },
        role: {
          type: 'string',
          enum: [Role.STUDENT, Role.TEACHER],
        },
      }
    }
  })
  @ApiResponse({
    status: 200, 
    description: 'Successful created user', 
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        email: { type: 'string' },
        name: { type: 'string' },
        role: { type: 'string' },
      }
    }
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
}
