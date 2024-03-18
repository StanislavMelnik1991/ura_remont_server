import { ApiProperty } from '@nestjs/swagger';
import { AcceptedLanguagesEnum } from 'shared/constants';

export class LocaleParamsDto {
  @ApiProperty({ enum: AcceptedLanguagesEnum })
  locale: AcceptedLanguagesEnum;
}
