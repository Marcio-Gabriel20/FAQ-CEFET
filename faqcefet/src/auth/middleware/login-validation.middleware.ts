import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { LoginRequestBody } from '../model/LoginRequestBody';
import { validate } from 'class-validator';

@Injectable()
export class LoginValidationMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
        const body = req.body;

        const loginRequestBody = new LoginRequestBody();
        loginRequestBody.email = body.email;
        loginRequestBody.password = body.password;

        const validations = await validate(loginRequestBody);

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
