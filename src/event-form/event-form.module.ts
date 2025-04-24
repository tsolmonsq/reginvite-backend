import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from 'src/events/entities/event.entity';
import { EventForm } from './entities/event-form.entity';
import { EventFormField } from './entities/event-form-field.entity';
import { EventFormService } from './event-form.service';
import { EventFormController } from './event-form.controller';
import { EventModule } from 'src/events/events.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventForm, EventFormField, Event]),
    forwardRef(() => EventModule),
  ],
  providers: [EventFormService],
  controllers: [EventFormController],
  exports: [EventFormService],
})
export class EventFormModule {}