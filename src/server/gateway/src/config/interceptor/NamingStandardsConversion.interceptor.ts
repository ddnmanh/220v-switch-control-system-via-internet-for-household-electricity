import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { camelCase, snakeCase, isPlainObject, transform } from 'lodash';

@Injectable()
export class NamingStandardsConversionInterceptor implements NestInterceptor {

    // Convert snake_case to camelCase in request
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();

        if (request.body) {
            request.body = this.convertSnakeToCamel(request.body);
        }

        return next.handle().pipe(
            map((data) => {
                // Convert camelCase to snake_case in response
                return this.convertCamelToSnake(data);
            }),
        );
    }

    private convertSnakeToCamel(obj: any): any {
        if (Array.isArray(obj)) {
            return obj.map((item) => this.convertSnakeToCamel(item));
        } else if (isPlainObject(obj)) {
            return transform(obj, (result, value, key) => {
                result[camelCase(key)] = this.convertSnakeToCamel(value);
            });
        }
        return obj;
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