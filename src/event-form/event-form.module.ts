import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventForm } from './event-form.entity';
import { EventFormField } from './event-form-field.entity';
import { EventFormService } from './event-form.service';
import { EventFormController } from './event-form.controller';
import { EventModule } from 'src/events/events.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventForm, EventFormField]),
    forwardRef(() => EventModule),
  ],
  providers: [EventFormService],
  controllers: [EventFormController],
  exports: [EventFormService],
})
export class EventFormModule {}