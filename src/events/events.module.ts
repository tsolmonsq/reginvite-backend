// --- events.module.ts ---
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { EventService } from './events.service';
import { EventController } from './events.controller';
import { Organizer } from '../organizers/organizer.entity';
import { OrganizersService } from '../organizers/organizers.service';
import { InvitationTemplate } from 'src/invitation-template/invitation-template.entity';
import { EventFormModule } from 'src/event-form/event-form.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, Organizer, InvitationTemplate]),
    EventFormModule
  ],
  providers: [EventService, OrganizersService],
  controllers: [EventController],
})
export class EventModule {}
