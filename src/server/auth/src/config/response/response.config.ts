// import { CommonRes } from "src/modules/auth/auth.pb";

// export default class StandardizeRes {
//     private readonly code: number;
//     private readonly data: any;

//     constructor(code:number = 200, data: any) {
//         this.code = code;
//         this.data = data;
//     }

//     /**
//      * Prepares the standardized response in the CommonRes format.
//      */
//     public formatResponse(): CommonRes {
//         return {
//             code: this.code,
//             status: this.data?.status || 'Request completed',
//             message: Array.isArray(this.data?.message) ? this.data.message : [],
//             data: this.isIndexedObject(this.data?.data)
//                 ? Object.values(this.data.data)
//                 : this.data?.data || null,
//         };
//     }

//     /**
//      * Checks if an object has only numeric keys (i.e., acts like an indexed object).
//      * @param obj The object to be checked.
//      * @returns True if the object has only numeric keys, otherwise false.
//      */
//     private isIndexedObject(obj: any): boolean {
//         return typeof obj === 'object' && obj !== null &&
//             !Array.isArray(obj) &&
//             Object.keys(obj).every(key => !isNaN(Number(key)));
//     }
// }


import { CommonRes } from "src/modules/auth/auth.pb";

export default class StandardizeRes {
    private codeValue: number = 200;
    private dataValue: any = null;

    /**
     * Sets the response code.
     * @param code The HTTP status code or application-specific code.
     * @returns This instance for method chaining.
     */
    public code(code: number): this {
        this.codeValue = code;
        return this;
    }

    /**
     * Sets the response data.
     * @param data The response body data.
     * @returns This instance for method chaining.
     */
    public body(data: any): this {
        this.dataValue = data;
        return this;
    }

    /**
     * Prepares the standardized response in the CommonRes format.
     * @returns A CommonRes object.
     */
    public formatResponse(): CommonRes {
        return {
            code: this.codeValue,
            status: this.dataValue?.status || 'Request completed',
            message: Array.isArray(this.dataValue?.message) ? this.dataValue.message : [],
            data: this.isIndexedObject(this.dataValue?.data)
                ? Object.values(this.dataValue.data)
                : this.dataValue?.data || null,
        };
    }

    /**
     * Checks if an object has only numeric keys (i.e., acts like an indexed object).
     * @param obj The object to be checked.
     * @returns True if the object has only numeric keys, otherwise false.
     */
    private isIndexedObject(obj: any): boolean {
        return typeof obj === 'object' && obj !== null &&
            !Array.isArray(obj) &&
            Object.keys(obj).every(key => !isNaN(Number(key)));
    }
}
