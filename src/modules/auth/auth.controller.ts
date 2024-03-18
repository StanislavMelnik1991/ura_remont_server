import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { authScheme } from 'shared/schemas';
import { ZodValidationPipe } from 'pipes/zodValidation.pipe';
import { AuthDto, TokenScheme } from 'types/swagger';

@ApiTags('Authorization')
@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: 'Registration user',
  })
  @ApiResponse({ status: 200, type: TokenScheme })
  @Post('/registration')
  @UsePipes(new ZodValidationPipe(authScheme))
  signup(@Body() data: AuthDto) {
    return this.authService.create(data);
  }

  @ApiOperation({
    summary: 'Authorization user',
  })
  @ApiResponse({ status: 200, type: TokenScheme })
  @Post('/authorization')
  @UsePipes(new ZodValidationPipe(authScheme))
  login(@Body() data: AuthDto) {
    return this.authService.login(data);
  }
}
