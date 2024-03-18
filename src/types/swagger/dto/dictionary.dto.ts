import { ApiProperty } from '@nestjs/swagger';
import { CreateDictionarySchemeType } from 'shared/schemas';

export class CreateDictionaryDto implements CreateDictionarySchemeType {
  @ApiProperty({
    description: 'ru language value',
    required: true,
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

export class UpdateDictionaryDto extends CreateDictionaryDto {
  @ApiProperty({
    description: 'ru language value',
    required: false,
    example: 'язык',
  })
  ru: string;
}
