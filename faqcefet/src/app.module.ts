// import { CacheModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { FaqModule } from './faq/faq.module';
import { FileModule } from './file/file.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    PrismaModule, 
    UserModule, 
    AuthModule, 
    FaqModule, 
    FileModule,
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
