import { ApiProperty } from "@nestjs/swagger";
import { Answer } from "../entity/answer.entity";
import { IsNumber, IsString } from "class-validator";

export class CreateAnswerDto extends Answer {
    @ApiProperty()
    @IsString()
    answer: string;

    @ApiProperty()
    @IsNumber()
    questionId: number;
}