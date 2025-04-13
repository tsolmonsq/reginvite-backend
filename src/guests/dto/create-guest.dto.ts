import { ApiProperty } from '@nestjs/swagger';

export class CreateGuestDto {
  @ApiProperty()
  first_name: string;

  @ApiProperty()
  last_name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone?: string;

  @ApiProperty()
  eventId: number;
}
