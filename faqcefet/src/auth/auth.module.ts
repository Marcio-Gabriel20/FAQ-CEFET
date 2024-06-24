import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.stategy';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { LoginValidationMiddleware } from './middleware/login-validation.middleware';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '@nestjs-modules/ioredis';
import { RedisCacheRepository } from 'src/faq/cache/repository/redis-cache.repository';

@Module({
  imports: [
    PassportModule, 
    UserModule, 
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30d' },
    }),
    ConfigModule.forRoot(),
    RedisModule.forRoot({
        type: 'single',
        url: process.env.REDIS_URL,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    LocalStrategy,
    RedisCacheRepository,
  ],
  exports: [
    RedisCacheRepository,
  ]
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoginValidationMiddleware).forRoutes('login');
  }
}
