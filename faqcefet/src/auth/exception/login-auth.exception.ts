import { ArgumentsHost, Catch, ExceptionFilter, UnauthorizedException } from "@nestjs/common";
import { Request, Response } from "express";

@Catch(UnauthorizedException)
export class LoginAuthExceptionFilter implements ExceptionFilter {
    catch(
        exception: UnauthorizedException, 
        host: ArgumentsHost
    ) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception instanceof UnauthorizedException ? 401 : null;

        const message =
            exception instanceof UnauthorizedException
            ? 'Incorrect email and/or password.'
            : 'Unauthorized';

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message,
        });
    }
}