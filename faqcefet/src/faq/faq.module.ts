import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FaqController } from './faq.controller';
import { FaqService } from './faq.service';
import { CreateQuestionValidationMiddleware } from './middleware/create-question-validation.middleware';

@Module({
    imports: [PrismaModule],
    controllers: [FaqController],
    providers: [FaqService],
    exports: [FaqService]
})
export class FaqModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(CreateQuestionValidationMiddleware).forRoutes('question');
    }
}
