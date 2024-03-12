import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { typeOrmConfig } from 'database';
import { BrandModule } from './brand/brand.module';
import { TypeModule } from './type/type.module';
import { AuthModule } from './auth/auth.module';
import { PrototypeModule } from './prototype/prototype.module';

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
    PrototypeModule,
  ],
})
export class AppModule {}
