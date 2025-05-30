import { Injectable } from '@nestjs/common';
const { nanoid, customAlphabet } = require('fix-esm').require('nanoid'); // https://stackoverflow.com/questions/73192655/how-to-install-nanoid-in-nestjs

@Injectable()
export class GenerateUUIDService {
    private readonly DEFAULT_ID_LENGTH = 21;
    private readonly ALPHABET = '123456789ABCDEFGHIJKLMNPQRSTUVWXYZ';

    generateId(): string {
        return nanoid(this.DEFAULT_ID_LENGTH);
    }

    generateIdWithLength(length: number): string {
        const customNanoid = customAlphabet(this.ALPHABET, length);
        return customNanoid();
    }

    generateIdWithCustomAlphabet(alphabet: string, length: number): string {
        const customNanoid = customAlphabet(alphabet, length);
        return customNanoid();
    }
}
