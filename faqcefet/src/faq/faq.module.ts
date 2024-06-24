import { RedisModule } from '@nestjs-modules/ioredis';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FileModule } from 'src/file/file.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RedisCacheRepository } from './cache/repository/redis-cache.repository';
import { FaqController } from './faq.controller';
import { FaqService } from './faq.service';
import { CreateQuestionValidationMiddleware } from './middleware/create-question-validation.middleware';
import { ValidateStringMiddleware } from './middleware/validate-string.middleware';

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
        consumer.apply(CreateQuestionValidationMiddleware).forRoutes({
            path: 'question',
            method: RequestMethod.POST
        });
        
        consumer.apply(ValidateStringMiddleware.bind(null, 'id')).forRoutes({
            path: 'question/:id',
            method: RequestMethod.GET
        });

        consumer.apply(ValidateStringMiddleware.bind(null, 'questionId')).forRoutes({
            path: 'question/:questionId',
            method: RequestMethod.DELETE
        });
    }
}
