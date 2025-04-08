import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  first_name: string;

  @ApiProperty()
  last_name: string;

  @ApiProperty({ required: false })
  phone?: string;

  @ApiProperty()
  role: string;
}
