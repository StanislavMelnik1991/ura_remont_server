import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { typeOrmConfig } from 'database';
import { DictionaryModule } from './dictionary';
import { TypeModule } from './type';

import {
  StaffAccessController,
  StaffAccessService,
  AdminsAccessService,
  AdminsAccessController,
} from 'routes';
import { BrandModule } from './brand';

@Module({
  controllers: [AdminsAccessController, StaffAccessController],
  providers: [AdminsAccessService, StaffAccessService],
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
    DictionaryModule,
    TypeModule,
    BrandModule,
  ],
})
export class AppModule {}
