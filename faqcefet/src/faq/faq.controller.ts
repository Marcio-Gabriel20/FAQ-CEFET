import { Body, Controller, Delete, Get, Param, Post, UploadedFiles, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role, User } from '@prisma/client';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { IsPublic } from 'src/auth/decorator/is-public.decorator';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { AuthExceptionFilter } from 'src/auth/exception/auth.exception';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles-auth.guard';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { QuestionCategory } from './enum/question-category.enum';
import { FaqService } from './faq.service';
import { QuestionResponse } from './model/QuestionResponse';

@ApiTags('faq')
@UseFilters(AuthExceptionFilter)
@Controller('faq')
export class FaqController {
    constructor(private readonly faqService: FaqService) {}

    @IsPublic()
    @Get('questions')
    @ApiResponse({ status: 200, type: [QuestionResponse] })
    async getAllQuestions() {
        return this.faqService.getAllQuestions();
    }

    @IsPublic()
    @Get('question/:id')
    @ApiResponse({ status: 200, type: QuestionResponse })
    async getQuestion(@Param('id') id: string) {
        return this.faqService.getQuestionById(id);
    }

    @IsPublic()
    @Get('questions/:category')
    @ApiResponse({status: 200, type: [QuestionResponse]})
    async getQuestionsByCategory(@Param('category') category: QuestionCategory) {
        return this.faqService.getQuestionsByCategory(category);
    }

    @Post('question')
    @UseInterceptors(FilesInterceptor('files', 5))
    @UseGuards(JwtAuthGuard)
    @UseFilters(AuthExceptionFilter)
    @ApiConsumes('multipart/form-data')
    @ApiBearerAuth()
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                files: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                },
                question: {
                    type: 'object',
                    properties: {
                        question: { type: 'string' },
                        questionCategory: { 
                            type: 'string',
                            enum: [
                                QuestionCategory.ADMISSION, 
                                QuestionCategory.COURSES, 
                                QuestionCategory.SCHEDULES, 
                                QuestionCategory.OTHER,
                            ],
                        },
                    }
                }
            },
        },
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Successful created question',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number' },
                question: { type: 'string' },
                questionCategory: { 
                    type: 'string',
                    enum: [
                        QuestionCategory.ADMISSION, 
                        QuestionCategory.COURSES, 
                        QuestionCategory.SCHEDULES, 
                        QuestionCategory.OTHER,
                    ],
                },
                userId: { type: 'number' },
                files: {
                    type: 'array',
                    items: {
                        type: "string"
                    }
                },
            }
        }
    })
    async createQuestion(@CurrentUser() user: User, @Body() createQuestionDto: CreateQuestionDto, @UploadedFiles() files: Express.Multer.File[]) {
        return this.faqService.createQuestion(user, createQuestionDto, files);
    }

    @Post('answer')
    @UseInterceptors(FilesInterceptor('files', 5))
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMINISTRATOR)
    @UseFilters(AuthExceptionFilter)
    @ApiConsumes('multipart/form-data')
    @ApiBearerAuth()
    @ApiBody({ 
        schema: {
            type: 'object',
            properties: {
                files: {
                    type: 'array',
                    items: {
                        type: "string"
                    }
                },
                answer: {
                    type: 'object',
                    properties: {
                        answer: { type: 'string' },
                        questionId: { type: 'number' },
                    }
                },
            }
        }
    })
    async createAnswer(@CurrentUser() user: User, @Body() createAnswerDto: CreateAnswerDto, @UploadedFiles() files: Express.Multer.File[]) {
        return this.faqService.createAnswer(user, createAnswerDto, files);
    }

    @Delete('question')
    @UseGuards(JwtAuthGuard)
    @UseFilters(AuthExceptionFilter)
    @ApiBearerAuth()
    async deleteQuestion(@CurrentUser() user: User, @Param('questionId') questionId: string) {
        return this.faqService.deleteQuestion(Number(questionId), user.id);
    }
}
