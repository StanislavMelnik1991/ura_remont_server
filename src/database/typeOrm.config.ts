import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Brand,
  Characteristic,
  CharacteristicValue,
  Dictionary,
  Product,
  ProductPrototype,
  ProductType,
  PropertyValue,
  PrototypeProperty,
  User,
} from './entities';

export const typeOrmConfig = () => {
  const host = process.env.POSTGRES_HOST;
  const port = Number(process.env.POSTGRES_PORT);
  const database = process.env.POSTGRES_DB;
  const username = process.env.POSTGRES_USER;
  const password = process.env.POSTGRES_PASSWORD;
  const ssl = !!process.env.POSTGRES_SSL || undefined;
  const url = process.env.POSTGRES_URL || undefined;

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
      PropertyValue,
      Characteristic,
      CharacteristicValue,
      User,
    ],
    logging: false,
    ssl,
    url,
    synchronize: true,
    type: 'postgres',
  });
};
