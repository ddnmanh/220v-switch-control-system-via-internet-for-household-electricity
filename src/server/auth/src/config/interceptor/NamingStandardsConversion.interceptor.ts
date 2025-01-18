import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { camelCase, isPlainObject, transform } from 'lodash';

@Injectable()
export class NamingStandardsConversionInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

        // let data = context.switchToRpc().getData();

        // Convert body from snake_case to camelCase in request
        if (context['args'][0]) {  
            context['args'][0] = this.convertSnakeToCamel(context['args'][0]);
        }

        return next.handle().pipe(
            map((data) => {
                return this.convertSnakeToCamel(data);
            }),
        );
    }

    // Convert snake_case to camelCase
    private convertSnakeToCamel(obj: any): any {
        if (Array.isArray(obj)) {
            return obj.map((item) => this.convertSnakeToCamel(item));
        } else if (isPlainObject(obj)) {
            return transform(obj, (result: any, value: any, key: any) => {
                result[camelCase(key)] = this.convertSnakeToCamel(value);
            });
        }
        return obj;
    }
}
