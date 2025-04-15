import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty()
  title: string;

  @ApiProperty({required: false, maxLength: 200 })
  description?: string;

  @ApiProperty()
  location: string;

  @ApiProperty({ example: '2025-05-10T09:00:00Z', type: String })
  start_time: Date;

  @ApiProperty({ example: '2025-05-10T12:00:00Z', type: String })
  end_time: Date;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Зургийн файл (jpg/png)',
  })
  image?: any;

  @ApiProperty()
  templateId?: number; 
}
