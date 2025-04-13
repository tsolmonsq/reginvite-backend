import * as QRCode from 'qrcode';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QRCodeService {
  async generateDataURL(text: string): Promise<string> {
    return QRCode.toDataURL(text); // base64 data:image/png үүсгэнэ
  }
}
