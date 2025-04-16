import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventForm } from './event-form.entity';
import { EventFormField } from './event-form-field.entity';
import { EventFormService } from './event-form.service';
import { EventFormController } from './event-form.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EventForm, EventFormField])],
  providers: [EventFormService],
  controllers: [EventFormController],
  exports: [EventFormService],
})
export class EventFormModule {}