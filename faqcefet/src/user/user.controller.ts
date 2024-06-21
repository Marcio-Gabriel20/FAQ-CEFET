import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { Role } from './enum/role.enum';
import { IsPublic } from 'src/auth/decorator/is-public.decorator';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  @IsPublic()
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
    description: 'Successful created', 
    type: User
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
}
