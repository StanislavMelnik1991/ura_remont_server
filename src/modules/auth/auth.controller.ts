import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from 'pipes/zodValidation.pipe';
import { TelegramAuthDto, TokenScheme } from 'types/swagger';
import { apiRouter } from 'shared/router';
import { AuthTelegramGuard } from 'guards/authTelegram.guard';
import { authTelegramScheme } from 'shared/schemas';

const { tgLogin, deleteTelegramUser, deleteUser } = apiRouter;

@ApiTags('Authorization')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  /* @ApiOperation({
    summary: 'Registration user',
  })
  @ApiResponse({ status: 200, type: TokenScheme })
  @Post(signup.baseRoute)
  @UsePipes(new ZodValidationPipe(scheme))
  signup(@Body() data: AuthDto) {
    return this.authService.create(data);
  } */

  @ApiOperation({
    summary: 'Authorization user with tg',
  })
  @ApiResponse({ status: 200, type: TokenScheme })
  @UseGuards(AuthTelegramGuard)
  @Post(tgLogin.route)
  @UsePipes(new ZodValidationPipe(authTelegramScheme))
  login(@Body() data: TelegramAuthDto) {
    return this.authService.telegramAuth(data);
  }

  @ApiOperation({
    summary: 'Delete user',
  })
  @ApiResponse({ status: 200, type: TokenScheme })
  @Delete(deleteUser.route)
  delete(@Param(deleteUser.mask, ParseIntPipe) id: number) {
    return this.authService.deleteUser(id);
  }

  @ApiOperation({
    summary: 'Delete user telegram',
  })
  @ApiResponse({ status: 200, type: TokenScheme })
  @Delete(deleteTelegramUser.route)
  deleteTg(@Param(deleteTelegramUser.mask, ParseIntPipe) id: number) {
    return this.authService.deleteUserTelegram(id);
  }
}
