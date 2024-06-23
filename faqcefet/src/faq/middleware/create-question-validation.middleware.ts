import { BadRequestException, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { CreateQuestionRequestBody } from "../model/CreateQuestionRequestBody";
import { validate } from "class-validator";

@Injectable()
export class CreateQuestionValidationMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
        const body = req.body;

        const createQuestionRequestBody = new CreateQuestionRequestBody();
        createQuestionRequestBody.question = body.question;
        createQuestionRequestBody.questionCategory = body.questionCategory;

        const validations = await validate(createQuestionRequestBody);

        if(validations.length) {
            throw new BadRequestException(
                validations.reduce((acc, curr) => {
                    return [...acc, ...Object.values(curr.constraints)];
                }, []),
            );
        }

        next();
    }

}