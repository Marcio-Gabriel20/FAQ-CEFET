import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { CreateAnswerDto } from './dto/create-answer.dto';

@Injectable()
export class FaqService {
    constructor(private prisma: PrismaService) {}

    async getAllQuestions() {
        return this.prisma.question.findMany({
            include: {
                answers: true,
            },
        });
    }

    async getQuestion(id: string) {
        return this.prisma.question.findUnique({
            where: { id: Number(id) },
            include: {
                answers: true,
            },
        });
    }

    async createQuestion(userId: number, createQuestionDto: CreateQuestionDto) {
        return this.prisma.question.create({
            data: {
                question: createQuestionDto.question,
                userId: userId,
            },
        });
    }

    async createAnswer(userId: number, createAnswerDto: CreateAnswerDto) {
        return this.prisma.answer.create({
            data: {
                answer: createAnswerDto.answer,
                questionId: createAnswerDto.questionId,
                userId: userId,
            },
        });
    }
}
