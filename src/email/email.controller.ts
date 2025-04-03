import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateEmailDto } from './dto/create-email.dto';

@Controller('email')
@ApiTags('email') // Group under the 'email' tag in Swagger
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  @ApiOperation({ summary: 'Send an HTML email invitation' }) // Updated summary for Swagger
  @ApiResponse({
    status: 200,
    description: 'Email sent successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Failed to send email',
  })
  async sendEmail(@Body() createEmailDto: CreateEmailDto) {
    try {
      const { to, subject } = createEmailDto;
      
      // HTML Invitation Template
      const htmlBody = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
              .email-container { background-color: #fff; padding: 20px; border-radius: 8px; text-align: center; }
              .header { font-size: 24px; color: #333; }
              .details { font-size: 16px; margin: 20px 0; }
              .button { display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; }
              .footer { font-size: 14px; color: #777; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header">Төгсөлтийн баяр</div>
              <div class="details">
                <p>Төгсөлтийн баярын арга хэмжээнд танийг урьж байна.</p>
                <p><b>Date:</b> June 17, 2025</p>
                <p><b>Time:</b> 11:00 AM</p>
                <p><b>Location:</b> МУИС, Хичээлийн 2-р байр, А заал</p>
                <p>Click below to RSVP:</p>
                <a href="https://example.com/rsvp" class="button">RSVP Now</a>
              </div>
              <div class="footer">Looking forward to seeing you there!</div>
            </div>
          </body>
        </html>
      `;

      const emailResponse = await this.emailService.sendEmail(to, subject, htmlBody);
      return { message: 'Email sent successfully!', emailResponse };
    } catch (error) {
      return { error: 'Failed to send email', details: error.message };
    }
  }
}
