import { ApiProperty } from "@nestjs/swagger";
import { Question } from "../entity/question.entity";
import { IsNumber, IsString } from "class-validator";

export class CreateQuestionDto extends Question {
    @ApiProperty()
    @IsString()
    question: string;
}