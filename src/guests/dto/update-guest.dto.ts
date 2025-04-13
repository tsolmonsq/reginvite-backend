import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateGuestDto {
  @ApiPropertyOptional()
  first_name?: string;

  @ApiPropertyOptional()
  last_name?: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiPropertyOptional({ example: 'Sent', enum: ['Sent', 'Pending', 'Failed', 'By form', 'New'] })
  status?: 'Sent' | 'Pending' | 'Failed' | 'By form' | 'New';
}
