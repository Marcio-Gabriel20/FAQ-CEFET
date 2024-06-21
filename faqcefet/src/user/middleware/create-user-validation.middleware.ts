import { BadRequestException, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { CreateUserRequestBody } from "../model/CreateUserRequestBody";
import { validate } from "class-validator";

@Injectable()
export class CreateUserValidationMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
        const body = req.body;

        const createUserRequestBody = new CreateUserRequestBody();
        createUserRequestBody.email = body.email;
        createUserRequestBody.password = body.password;
        createUserRequestBody.name = body.name;
        createUserRequestBody.role = body.role;

        const validations = await validate(createUserRequestBody);

        if (validations.length) {
            throw new BadRequestException(
                validations.reduce((acc, curr) => {
                    return [...acc, ...Object.values(curr.constraints)];
                }, []),
            );
        }

        const emailDomain = "@cefet-rj.br";
        if (!body.email.endsWith(emailDomain)) {
            throw new BadRequestException(`Email must end with ${emailDomain}`);
        }

        next();
    }

}