import { ApiProperty } from '@nestjs/swagger';

export class CreateInvitationTemplateDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  html: string;

  @ApiProperty()
  font: string;

  @ApiProperty()
  color: string;

  @ApiProperty()
  show_qr: boolean;

  @ApiProperty()
  show_rsvp: boolean;
}
