import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { EventService } from './events.service';
import { EventController } from './events.controller';
import { Organizer } from '../organizers/organizer.entity';
import { OrganizersService } from '../organizers/organizers.service';
import { InvitationTemplate } from 'src/invitation-template/entities/invitation-template.entity';
import { EventFormModule } from 'src/event-form/event-form.module';
import { Template } from 'src/invitation-template/entities/template.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, Organizer, InvitationTemplate, Template]),
    EventFormModule,

    forwardRef(() => EventFormModule),
  ],
  providers: [EventService, OrganizersService],
  controllers: [EventController],
})
export class EventModule {}
