import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { FileModule } from 'src/file/file.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FaqController } from './faq.controller';
import { FaqService } from './faq.service';
import { CreateQuestionValidationMiddleware } from './middleware/create-question-validation.middleware';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '@nestjs-modules/ioredis';
import { RedisCacheRepository } from './cache/repository/redis-cache.repository';

@Module({
    imports: [
        PrismaModule, 
        FileModule,
        ConfigModule.forRoot(),
        RedisModule.forRoot({
            type: 'single',
            url: process.env.REDIS_URL,
        }),
    ],
    controllers: [FaqController],
    providers: [
        FaqService,
        RedisCacheRepository,
    ],
    exports: [
        FaqService,
        RedisCacheRepository,
    ],
})
export class FaqModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(CreateQuestionValidationMiddleware).forRoutes('question');
    }
}
