import { Module } from '@nestjs/common';
import { GuestsService } from './guests.service';
import { GuestsController } from './guests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guest } from './entities/guest.entity';
import { Event } from 'src/events/entities/event.entity';
import { EmailService } from 'src/email/email.service';
import { ConfigModule } from '@nestjs/config';
import { InvitationTemplate } from 'src/invitation-template/entities/invitation-template.entity';
import { QRCodeModule } from 'src/qr/qr-code.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Guest, Event, InvitationTemplate]),
    ConfigModule,
    QRCodeModule
  ],
  controllers: [GuestsController],
  providers: [GuestsService, EmailService],
  exports: [GuestsService],
})
export class GuestsModule {}
