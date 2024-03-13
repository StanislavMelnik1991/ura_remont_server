import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Brand,
  Dictionary,
  Product,
  ProductPrototype,
  ProductType,
  PrototypeProperty,
  PrototypePropertyValue,
  Characteristic,
  CharacteristicValue,
} from './';

export const typeOrmConfig = () => {
  const host = process.env.POSTGRES_HOST;
  const port = Number(process.env.POSTGRES_PORT);
  const database = process.env.POSTGRES_DB;
  const username = process.env.POSTGRES_USER;
  const password = process.env.POSTGRES_PASSWORD;

  return TypeOrmModule.forRoot({
    host,
    port,
    database,
    username,
    password,
    entities: [
      Brand,
      Dictionary,
      Product,
      ProductPrototype,
      ProductType,
      PrototypeProperty,
      PrototypePropertyValue,
      Characteristic,
      CharacteristicValue,
    ],
    logging: false,
    synchronize: true,
    type: 'postgres',
  });
};
