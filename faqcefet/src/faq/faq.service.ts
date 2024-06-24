import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { QuestionCategory, Role, User } from '@prisma/client';
import * as fs from 'fs';
import { join } from 'path';
import { FileService } from 'src/file/file.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisCacheRepository } from './cache/repository/redis-cache.repository';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { CreateQuestionDto } from './dto/create-question.dto';

@Injectable()
export class FaqService {
    constructor(
        private prisma: PrismaService,
        private readonly fileService: FileService,
        private readonly redisCacheRepository: RedisCacheRepository,
    ) {}

    async getAllQuestions() {
        const questions = await this.prisma.question.findMany({
            include: {
                answers: true,
            },
        });

        if(questions) {
            return questions;
        }
    }

    async getQuestionById(id: string) {
        const questionCache = await this.redisCacheRepository.getData(id);

        if(questionCache) {
            console.log('Cache response');
            return questionCache;
        }

        const question = await this.prisma.question.findUnique({
            where: { id: Number(id) },
            include: {
                answers: true,
            },
        });

        if(question) {
            console.log('Database response');
            await this.redisCacheRepository.saveData(question, String(question.id));
            return question;
        }
    }

    async getQuestionsByCategory(category: QuestionCategory) {
        const question = await this.prisma.question.findMany({
            where: {
                questionCategory: category,
            },
            include: {
                answers: true,
            },
        });

        return question;
    }

    async createQuestion(user: User, createQuestionDto: CreateQuestionDto, files: Express.Multer.File[]) {
        let filesQuestion: string[] = [];
        const storagePath = join(__dirname, '../../storage');

        if(!fs.existsSync(storagePath)) {
            fs.mkdirSync(storagePath, { recursive: true });
        }

        try {
            for (const file of files) {
                const uploadedFile = await this.fileService.upload(user, file, storagePath);
                filesQuestion.push(uploadedFile);
            }
        } catch (e) {
            throw new BadRequestException(e.message);
        }

        return await this.prisma.question.create({
            data: {
                question: createQuestionDto.question,
                questionCategory: createQuestionDto.questionCategory,
                userId: user.id,
                files: filesQuestion,
            },
        });
    }

    async createAnswer(user: User, createAnswerDto: CreateAnswerDto, files: Express.Multer.File[]) {
        let filesAnswer: string[] = [];
        const storagePath = join(__dirname, '../../storage');

        if(!fs.existsSync(storagePath)) {
            fs.mkdirSync(storagePath, { recursive: true });
        }

        try {
            for (const file of files) {
                const uploadedFile = await this.fileService.upload(user, file, storagePath);
                filesAnswer.push(uploadedFile);
            }
        } catch (e) {
            throw new BadRequestException(e.message);
        }

        return await this.prisma.answer.create({
            data: {
                answer: createAnswerDto.answer,
                questionId: Number(createAnswerDto.questionId),
                userId: user.id,
                files: filesAnswer,
            },
        });
    }

    async deleteQuestion(questionId: number, userId: number): Promise<void> {
        const question = await this.prisma.question.findUnique({
            where: { id: questionId },
            include: { user: true },
        });

        if(!question) {
            throw new Error('Question not found');
        }

        if(question.userId !== userId) {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                select: { role: true },
            });

            if(!user || user.role !== Role.ADMINISTRATOR) {
                throw new Error('Permission denied');
            }
        }

        const questionCache = await this.redisCacheRepository.getData(String(question.id));

        if(questionCache) {
            console.log('Cache response');
            await this.redisCacheRepository.deleteData(String(question.id));
        }

        const answers = await this.prisma.answer.findMany({
            where: { questionId: questionId },
        });

        for(const answer of answers) {
            await this.fileService.delete(answer.files);
        }

        await this.prisma.answer.deleteMany({
            where: { questionId: questionId },
        });

        await this.fileService.delete(question.files);

        await this.prisma.question.delete({
            where: { id: questionId },
        });
    }

    async updateQuestion(questionId: number, userId: number, updateData: Partial<CreateQuestionDto>): Promise<void> {
        const question = await this.prisma.question.findUnique({
            where: { id: questionId },
        });

        if(!question) {
            throw new Error('Question not found');
        }

        if(question.userId !== userId) {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                select: { role: true }
            });

            if(!user || user.role !== Role.ADMINISTRATOR) {
                throw new Error('Permission denied');
            }
        }

        await this.prisma.question.update({
            where: { id: questionId },
            data: {
                question: updateData.question,
                questionCategory: updateData.questionCategory,
            }
        });
    }
}
