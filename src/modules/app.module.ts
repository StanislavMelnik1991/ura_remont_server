import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { typeOrmConfig } from 'database';
import { PrototypeModule } from './prototype';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
    }),
    typeOrmConfig(),
    PrototypeModule,
  ],
})
export class AppModule {}
