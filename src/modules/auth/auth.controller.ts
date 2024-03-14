import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SingUpDto, TokenResponse } from 'shared/schemas';

@ApiTags('Authorization')
@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: 'Registration user',
  })
  @ApiResponse({ status: 200, type: TokenResponse })
  @Post('/registration')
  signup(@Body() data: SingUpDto) {
    return this.authService.create(data);
  }

  @ApiOperation({
    summary: 'Authorization user',
  })
  @ApiResponse({ status: 200, type: TokenResponse })
  @Post('/authorization')
  login(@Body() data: SingUpDto) {
    return this.authService.login(data);
  }
}
