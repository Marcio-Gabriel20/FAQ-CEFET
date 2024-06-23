import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

@ApiExtraModels()
export class CreateQuestionRequestBody {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    question: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    questionCategory: string;
}