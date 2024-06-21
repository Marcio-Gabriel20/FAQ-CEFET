import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role, User } from '@prisma/client';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { IsPublic } from 'src/auth/decorator/is-public.decorator';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { FaqService } from './faq.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { CreateAnswerDto } from './dto/create-answer.dto';

@ApiTags('faq')
@Controller('faq')
export class FaqController {
    constructor(private readonly faqService: FaqService) {}

    @IsPublic()
    @Get('questions')
    async getAllQuestions() {
        return this.faqService.getAllQuestions();
    }

    @IsPublic()
    @Get('question/:id')
    async getQuestion(@Param('id') id: string) {
        return this.faqService.getQuestion(id);
    }

    @UseGuards(JwtAuthGuard)
    @Roles(Role.STUDENT)
    @ApiBearerAuth()
    @Post('question')
    async createQuestion(@CurrentUser() user: User, @Body() createQuestionDto: CreateQuestionDto) {
        return this.faqService.createQuestion(user.id, createQuestionDto);
    }

    @UseGuards(JwtAuthGuard)
    @Roles(Role.TEACHER)
    @ApiBearerAuth()
    @Post('answer')
    async createAnswer(@CurrentUser() user: User, @Body() createAnswerDto: CreateAnswerDto) {
        return this.faqService.createAnswer(user.id, createAnswerDto);
    }
}
