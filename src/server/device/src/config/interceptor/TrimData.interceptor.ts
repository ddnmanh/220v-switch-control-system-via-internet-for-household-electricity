import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TrimDataInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

        // const data = context.switchToRpc().getData(); 

        // Trim data body in request
        if (context['args'][0]) {
            context['args'][0] = this.trimValues(context['args'][0]);
        }
         
        // Trim data body in response
        return next.handle().pipe(
            map((data) => { 
                return this.trimValues(data);
            }),
        );
    }

    private trimValues(data: any): any {
        if (typeof data === 'string') {
            return data.trim();
        } else if (Array.isArray(data)) {
            return data.map((item) => this.trimValues(item));
        } else if (typeof data === 'object' && data !== null) {
            return Object.keys(data).reduce((acc, key) => {
                acc[key] = this.trimValues(data[key]);
                return acc;
            }, {});
        }
        return data;
    } 
}
