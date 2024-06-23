import { ApiProperty } from "@nestjs/swagger";
import { Answer } from "../entity/answer.entity";
import { IsNumber, IsString } from "class-validator";

export class CreateAnswerDto {
    @ApiProperty()
    @IsString()
    answer: string;

    @ApiProperty()
    @IsString()
    questionId: string;
}