import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { typeOrmConfig } from 'database';
import { BrandModule } from './brand';
import { TypeModule } from './type';
import { AuthModule } from './auth';

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
    BrandModule,
    TypeModule,
    AuthModule,
  ],
})
export class AppModule {}
