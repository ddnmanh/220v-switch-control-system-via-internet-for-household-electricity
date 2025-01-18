// pipes/custom-validation.pipe.ts
import { BadRequestException, ValidationPipe, ValidationError } from '@nestjs/common';

export class CustomValidationPipe extends ValidationPipe {
    constructor() {
        super({
            exceptionFactory: (errors: ValidationError[]) => {
                const result = errors.map((error) => ({
                    property: error.property,
                    message: error.constraints
                        ? error.constraints[Object.keys(error.constraints)[0]]
                        : 'Invalid input',
                }));
                return new BadRequestException(result);
            },
            stopAtFirstError: true,
        });
    }
}

// Using for validation with DTO in controller