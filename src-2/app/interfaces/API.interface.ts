
export interface ResponseInvalidFieldDTO {
    field: string;
    message: string;
}

export interface ResponseDTO {
    status: number;
    error: string;
    message: string;
    invalid_field: ResponseInvalidFieldDTO[];
    data: Record<string, any>;
}
