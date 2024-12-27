import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EncryptService {

    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hashSync(password, 10);
    }

    async comparePasswordHashed(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compareSync(plainTextPassword, hashedPassword);
    }
}