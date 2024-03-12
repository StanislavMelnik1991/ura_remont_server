import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { typeOrmConfig } from 'database';
import { LocalizedModule } from './localized';
import { AuthModule } from './auth';
import { AdminModule } from './admin';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
      isGlobal: true,
    }),
    typeOrmConfig(),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY,
      signOptions: {
        expiresIn: '24h',
      },
    }),
    AdminModule,
    LocalizedModule,
    AuthModule,
  ],
})
export class AppModule {}
