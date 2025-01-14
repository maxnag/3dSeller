import { Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Response } from 'express';

@Catch()
export class ApiExceptionFilter {
  async catch(exception: HttpException, host: ArgumentsHost): Promise<void> {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    // @ts-ignore
    switch (exception.cause?.code) {
      case 'P2025':
        statusCode = HttpStatus.NOT_FOUND;
        break;
      case 'P2002':
        statusCode = HttpStatus.CONFLICT;
        break;
    }

    response.status(statusCode).json({
      message: exception.message
    });
  }
}
