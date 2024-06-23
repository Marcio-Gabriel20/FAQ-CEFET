import { ExceptionFilter, Catch, ArgumentsHost, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(UnauthorizedException, ForbiddenException)
export class AuthExceptionFilter implements ExceptionFilter {
    catch(
        exception: UnauthorizedException | ForbiddenException,
        host: ArgumentsHost,
    ) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception instanceof UnauthorizedException ? 401 : 403;

        const message =
            exception instanceof UnauthorizedException
            ? 'You need to be authenticated to access this feature.'
            : 'You do not have permission to access this feature.';

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message,
        });
    }
}
