
export interface ResponseMessageDTO {
    property: string;
    message: string;
}

export interface ResponseDTO {
    code: number;
    message: ResponseMessageDTO[];
    data: Record<string, any>;
}
