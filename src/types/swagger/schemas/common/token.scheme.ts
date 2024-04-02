import { ApiProperty } from '@nestjs/swagger';

export class TokenScheme {
  @ApiProperty({
    description: 'Bearer',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwicm9sZSI6InVzZXIiLCJpYXQiOjE3MTA0MjY4NDMsImV4cCI6MTcxMDUxMzI0M30.2UjjGb6fBNW7UEycS1GIYX1ElBGokNHpEBOP86Cpf8A',
    required: true,
  })
  token: string;
}
