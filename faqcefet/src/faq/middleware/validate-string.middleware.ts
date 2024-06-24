import { BadRequestException, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class ValidateStringMiddleware implements NestMiddleware {
    constructor(private readonly paramName: string) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const paramValue = req.params[this.paramName] || req.body[this.paramName] || req.query[this.paramName];

        if(typeof paramValue !== 'string') {
            throw new BadRequestException(`Parameter ${this.paramName} must be a string`);
        }

        next();
    }
}