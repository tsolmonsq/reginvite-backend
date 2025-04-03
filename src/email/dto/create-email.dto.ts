import { ApiProperty } from '@nestjs/swagger';

export class CreateEmailDto {
  @ApiProperty({
    description: 'Recipient email address',
    example: 'recipient@example.com',
  })
  to: string;

  @ApiProperty({
    description: 'Subject of the email',
    example: 'Hello World',
  })
  subject: string;
}
