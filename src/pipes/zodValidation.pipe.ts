import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ZodError, ZodIssue, ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException(formatError(error));
      } else {
        throw new BadRequestException('Validation failed');
      }
    }
  }
}

const formatError = (zodError: ZodError): ValidationErrors => {
  const errors: ValidationErrors = {};

  zodError.issues.forEach((error: ZodIssue) => {
    const key = error.path.join('.');

    if (!errors[key]) {
      errors[key] = [];
    }

    (errors[key] as string[]).push(error.message);
  });

  return errors;
};

type ValidationErrors = {
  [name: string]: string[] | string;
};
