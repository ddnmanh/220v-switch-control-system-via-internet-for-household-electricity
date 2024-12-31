import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { snakeCase, isPlainObject, transform } from 'lodash';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {

        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;


        const responseMessage = exception instanceof HttpException ? exception.getResponse() : 'Something went wrong, maybe not you but us, it will work again soon!';

        const message : any =
            typeof responseMessage === 'string'
                ? [{ property: 'server', message: responseMessage || 'Something went wrong, maybe not you but us, it will work again soon!' }]
                : responseMessage['message'];

        response.status(status).json( // Read README.md for more information
            this.convertCamelToSnake({
                code: status,
                status: message[0].message,
                message: message,
                data: null,
                path: request.url,
                // timestamp: new Date().toISOString()
            })
        );
    }

    private convertCamelToSnake(obj: any): any {
        if (Array.isArray(obj)) {
            return obj.map((item) => this.convertCamelToSnake(item));
        } else if (isPlainObject(obj)) {
            return transform(obj, (result, value, key) => {
                result[snakeCase(key)] = this.convertCamelToSnake(value);
            });
        }
        return obj;
    }
}
