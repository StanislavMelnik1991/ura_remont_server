import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LocalizedService } from 'services';

@ApiTags('Localized')
@Controller('api/:locale')
export class LocalizedController {
  constructor(private localizedService: LocalizedService) {}

  @ApiOperation({
    summary: 'Update existed translation',
    description: 'Only for staff',
  })
  @ApiResponse({ status: 200, type: String })
  @Get('/locale')
  update(@Param('locale') locale: string) {
    return { locale };
  }
}
