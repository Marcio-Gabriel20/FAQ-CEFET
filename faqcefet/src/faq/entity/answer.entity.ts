import { ApiExtraModels } from "@nestjs/swagger";

@ApiExtraModels()
export class Answer {
    id?: number;
    answer: string;
    questionId: number;
    userId: number;
}