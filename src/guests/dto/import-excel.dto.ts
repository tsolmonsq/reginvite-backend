import { IsNumberString } from 'class-validator';

export class ImportGuestExcelDto {
  @IsNumberString()
  eventId: string;
}