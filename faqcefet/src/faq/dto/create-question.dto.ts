import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { Question } from "../entity/question.entity";
import { QuestionCategory } from "@prisma/client";

export class CreateQuestionDto extends Question {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    question: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    questionCategory: QuestionCategory;
}