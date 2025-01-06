import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AuthServiceClient, AUTH_SERVICE_NAME, ValidateTokenReq, CommonRes } from '../../../proto/auth.pb';

@Injectable()
export class AuthService {
    private svc: AuthServiceClient;

    @Inject(AUTH_SERVICE_NAME)
    private readonly client: ClientGrpc;

    public onModuleInit(): void {
        this.svc = this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
    }

    public async validateToken(body: ValidateTokenReq): Promise<CommonRes> {

        try {
            let data: CommonRes = await firstValueFrom(this.svc.validateToken({ token: body.token, type: body.type }));

            console.log('validate token in gateway', data);

            return data;

        } catch (error: any) {
            console.error('Received gRPC Error:', error);
            // Phân loại lỗi dựa trên mã lỗi gRPC
            switch (error.code) {
                case 14: // UNAVAILABLE
                console.error('gRPC Service Unavailable:', error.message);
                // Xử lý lỗi kết nối
                break;
                case 5: // NOT_FOUND
                console.error('Resource Not Found:', error.message);
                // Xử lý lỗi không tìm thấy
                break;
                // Các mã lỗi khác có thể xử lý thêm tại đây
                default:
                console.error('Unknown gRPC Error:', error.message);
                break;
            }

            // In ra các chi tiết bổ sung nếu cần
            console.error('Error details:', error.details);
            console.error('Metadata:', error.metadata);
        }
    }
}
