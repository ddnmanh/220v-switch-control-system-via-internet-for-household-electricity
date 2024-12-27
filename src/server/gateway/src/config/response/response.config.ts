import { CommonRes } from "src/modules/auth/auth.pb";

export default class StandardizeRes {
    private code: number;
    private status: string;
    private message: any[];
    private data: any | any[];

    constructor(data: any) {
        this.code = data.code;
        this.status = data.status;
        this.message = data.message;
        this.data = data.data ? data.data : null;
    }

    public resp(): CommonRes {
        return {
            code: this.code,
            status: this.status,
            message: this.message,
            data: (this.data && this.isIndexedObject(this.data)) ? Object.values(this.data) : this.data,
        }
    }

    private isIndexedObject(data: any): boolean {
        if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
            return Object.keys(data).every(key => !isNaN(Number(key)));
        }
        return false;
    }
}
