import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'services';

@ApiTags('Auth')
@Controller('api/:locale')
export class AuthController {
  constructor(private authService: AuthService) {}

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
