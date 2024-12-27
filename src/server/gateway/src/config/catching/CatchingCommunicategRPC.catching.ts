import { HttpException, HttpStatus } from '@nestjs/common';
import * as grpc from '@grpc/grpc-js';

export const HTTP_CODE_FROM_GRPC: Record<number, number> = {
    [grpc.status.OK]: HttpStatus.OK,
    [grpc.status.CANCELLED]: HttpStatus.METHOD_NOT_ALLOWED,
    [grpc.status.UNKNOWN]: HttpStatus.BAD_GATEWAY,
    [grpc.status.INVALID_ARGUMENT]: HttpStatus.UNPROCESSABLE_ENTITY,
    [grpc.status.DEADLINE_EXCEEDED]: HttpStatus.REQUEST_TIMEOUT,
    [grpc.status.NOT_FOUND]: HttpStatus.NOT_FOUND,
    [grpc.status.ALREADY_EXISTS]: HttpStatus.CONFLICT,
    [grpc.status.PERMISSION_DENIED]: HttpStatus.FORBIDDEN,
    [grpc.status.RESOURCE_EXHAUSTED]: HttpStatus.TOO_MANY_REQUESTS,
    [grpc.status.FAILED_PRECONDITION]: HttpStatus.PRECONDITION_REQUIRED,
    [grpc.status.ABORTED]: HttpStatus.METHOD_NOT_ALLOWED,
    [grpc.status.OUT_OF_RANGE]: HttpStatus.PAYLOAD_TOO_LARGE,
    [grpc.status.UNIMPLEMENTED]: HttpStatus.NOT_IMPLEMENTED,
    [grpc.status.INTERNAL]: HttpStatus.INTERNAL_SERVER_ERROR,
    [grpc.status.UNAVAILABLE]: HttpStatus.NOT_FOUND,
    [grpc.status.DATA_LOSS]: HttpStatus.INTERNAL_SERVER_ERROR,
    [grpc.status.UNAUTHENTICATED]: HttpStatus.UNAUTHORIZED,
};


// not get message from grpc error, only get code
// will fix later, for now just use code
export class CatchingCommunicategRPC {
    public static catchRPCError(error: any): Promise<Object> {

        if (!error || typeof error.code === 'undefined') {
            throw new HttpException('Something went wrong from my service, it will work again soon!', HttpStatus.INTERNAL_SERVER_ERROR);
        } else {

            // mTLS not matching
            if (error.code == 14) {
                throw new HttpException('Something went wrong from my service, it will work again soon!', HttpStatus.INTERNAL_SERVER_ERROR);
            }

            // Unknown error
            throw new HttpException(JSON.parse(error.details), HttpStatus.INTERNAL_SERVER_ERROR);

        }
    }
}
