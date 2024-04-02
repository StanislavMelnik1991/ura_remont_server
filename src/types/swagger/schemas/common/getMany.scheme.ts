import { ApiProperty } from '@nestjs/swagger';

export class GetManySwaggerScheme<T> {
  @ApiProperty()
  total: number;
  @ApiProperty({ isArray: true })
  data: T;
}
