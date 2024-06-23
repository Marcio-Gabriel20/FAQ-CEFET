import { ApiExtraModels } from "@nestjs/swagger";
import { Answer } from "./answer.entity";
import { QuestionCategory } from "@prisma/client";

@ApiExtraModels()
export class Question {
    id?: number;
    question: string;
    questionCategory: QuestionCategory;
    userId: number;
    files?: string[];
    answers?: Answer[];
}