import { ApiExtraModels } from "@nestjs/swagger";
import { Answer } from "./answer.entity";

@ApiExtraModels()
export class Question {
    id?: number;
    question: string;
    userId: number;
    answers?: Answer[];
}