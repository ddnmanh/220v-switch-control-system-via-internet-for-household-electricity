

export class ErrServiceRes {
    property: string;
    message: string;
}

export class ServiceRes { 
    status: string;
    message: ErrServiceRes[];
    data: any;

    constructor(s: string, m: ErrServiceRes[], d: any) {
        this.status = s;
        this.message = m;
        this.data = d;
    }
}