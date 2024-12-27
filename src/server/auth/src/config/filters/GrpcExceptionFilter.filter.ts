
import { Catch, RpcExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class GrpcExceptionFilter implements RpcExceptionFilter<RpcException> {
    catch(exception: RpcException, host: ArgumentsHost): Observable<any> {

        console.log("gRPC Exception Filter");


        // Get code, message from throw any where in the service
        // just like throw new RpcException({ code: 2, message: 'User not found' });
        // code follow after documentation https://grpc.io/docs/guides/status-codes/
        const error = exception.getError() as { code: number; message: string };

        console.log("error", error);


        return throwError(() => {
                return {
                    code: error.code,
                    message: JSON.stringify({
                        status: error.message || 'Unknown error',
                        message: [
                            {
                                property: 'service',
                                message: error.message || 'Unknown error',
                            }
                        ],
                    })
                };
            }
        );
    }
}
