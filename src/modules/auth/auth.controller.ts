import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from 'pipes/zodValidation.pipe';
import { AuthDto, TokenScheme } from 'types/swagger';
import { apiRouter } from 'shared/routes';

const {
  auth: { scheme, signIn, signup },
} = apiRouter;

@ApiTags('Authorization')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: 'Registration user',
  })
  @ApiResponse({ status: 200, type: TokenScheme })
  @Post(signup.baseRoute)
  @UsePipes(new ZodValidationPipe(scheme))
  signup(@Body() data: AuthDto) {
    return this.authService.create(data);
  }

  @ApiOperation({
    summary: 'Authorization user',
  })
  @ApiResponse({ status: 200, type: TokenScheme })
  @Post(signIn.baseRoute)
  @UsePipes(new ZodValidationPipe(scheme))
  login(@Body() data: AuthDto) {
    return this.authService.login(data);
  }
}
