import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { Answer, Question, QuestionCategory } from "@prisma/client";

@ApiExtraModels()
export class QuestionResponse implements Question {    
    @ApiProperty()
    id: number;
    
    @ApiProperty()
    question: string;

    @ApiProperty()
    questionCategory: QuestionCategory;

    @ApiProperty()
    userId: number;

    @ApiProperty()
    files: string[];

    @ApiProperty()
    answers: Answer[];
}