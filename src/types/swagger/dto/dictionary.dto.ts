import { ApiProperty } from '@nestjs/swagger';
import { adminRouter } from 'shared/routes';
import { z } from 'zod';

const { scheme } = adminRouter.dictionary.current.update;

type BaseType = z.infer<typeof scheme>;

export class UpdateDictionaryDto implements BaseType {
  @ApiProperty({
    description: 'ru language value',
    required: false,
    example: 'язык',
  })
  ru: string;

  @ApiProperty({
    description: 'belarus language value',
    required: false,
    example: 'мова',
  })
  be: string;

  @ApiProperty({
    description: 'ukrainian language value',
    required: false,
    example: 'мова',
  })
  uk: string;

  @ApiProperty({
    description: 'english language value',
    required: false,
    example: 'language',
  })
  en: string;

  @ApiProperty({
    description: 'poland language value',
    required: false,
    example: 'language',
  })
  pl: string;
}

export class CreateDictionaryDto extends UpdateDictionaryDto {
  @ApiProperty({
    description: 'ru language value',
    required: true,
    example: 'язык',
  })
  ru: string;
}
