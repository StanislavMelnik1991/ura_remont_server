import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { createHash, createHmac } from 'crypto';
import { Observable } from 'rxjs';
import { apiRouter } from 'shared/routes';
import { z } from 'zod';

@Injectable()
export class AuthTelegramGuard implements CanActivate {
  constructor() {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { scheme } = apiRouter.auth.telegram;

    type TgAuthSchemeType = z.infer<typeof scheme>;

    const req = context.switchToHttp().getRequest();
    const {
      auth_date,
      first_name,
      hash,
      id,
      photo_url,
      username,
    }: TgAuthSchemeType = req.body;
    const data_check_string = `auth_date=${auth_date}\nfirst_name=${first_name}\nid=${id}\nphoto_url=${photo_url}\nusername=${username}`;
    const bot_token = process.env.TG_BOT_TOKEN;
    if (!bot_token) {
      throw new InternalServerErrorException("bot token doesn't exist");
    }
    const secret_key = createHash('sha256').update(bot_token).digest();
    const hmac = createHmac('sha256', secret_key)
      .update(data_check_string)
      .digest('hex');
    if (hmac === hash) {
      return true;
    } else {
      throw new ForbiddenException();
    }
  }
}
