import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { FaqModule } from './faq/faq.module';
import * as cacheManager from 'cache-manager';

@Module({
  imports: [
    PrismaModule, 
    UserModule, 
    AuthModule, 
    FaqModule,
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
