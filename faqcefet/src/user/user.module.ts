import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { CreateUserValidationMiddleware } from './middleware/create-user-validation.middleware';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  exports: [UserService]
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CreateUserValidationMiddleware).forRoutes('user');
  }
}
