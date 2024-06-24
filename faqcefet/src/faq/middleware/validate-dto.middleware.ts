import { BadRequestException, Injectable, NestMiddleware } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class ValidateStringMiddleware implements NestMiddleware {
    constructor(private readonly dtoClass: any) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const dtoInstance = plainToInstance(this.dtoClass, req.body);
        const errors = await validate(dtoInstance);

        if(errors.length > 0) {
            const errorMessages = errors.map(error => Object.values(error.constraints).join(', ')).join('; ');
            throw new BadRequestException(`Validation failed: ${errorMessages}`);
        }

        next();
    }
}