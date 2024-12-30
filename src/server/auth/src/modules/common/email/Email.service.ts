import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class EmailService {

    constructor(private configService: ConfigService) {}

    public transporter = nodemailer.createTransport({
        host: this.configService.get<string>('email_host'),
        port: this.configService.get<number>('email_port'),
        secure: this.configService.get<boolean>('port'), // true for port 465, false for other ports
        auth: {
            user: this.configService.get<string>('email_user'),
            pass: this.configService.get<string>('email_pass'),
        },
    })


    public async sendOTPVerifyRegisterAccount(toEmail: string, otp: string): Promise<boolean> {
        const info = await this.transporter.sendMail({
            from: 'Smartome',
            to: toEmail,
            subject: "Mã xác đăng ký tài khoản Smartome",
            text: "Mã xác thực của bạn là: " + otp,
            html: `<b>${otp}</b>`,
        });

        console.log("Message sent: %s", info.messageId);

        if (info.messageId) {
            return true;
        } else {
            return false;
        }
    }
}
