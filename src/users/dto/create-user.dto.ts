import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'The name of the user' }) 
  name: string;

  @ApiProperty({ description: 'The email address of the user' })
  email: string;
}
