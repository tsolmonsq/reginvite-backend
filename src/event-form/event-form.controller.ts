import {
    Controller,
    Get,
    Patch,
    Param,
    Body,
    Query,
  } from '@nestjs/common';
  import { EventFormService } from './event-form.service';
  import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
  import { EventFormField } from './entities/event-form-field.entity';
  import { ParseIntPipe } from '@nestjs/common';
  
  @ApiTags('Event Form') 
  @Controller('event-forms')
  export class EventFormController {
    constructor(private readonly eventFormService: EventFormService) {}
  
    @Get(':eventId/public')
    getPublic(@Param('eventId', ParseIntPipe) eventId: number) {
      return this.eventFormService.getPublicForm(eventId);
    }

    @Get(':eventId/rsvp')
    getRsvp(@Param('eventId', ParseIntPipe) eventId: number) {
      return this.eventFormService.getRsvpForm(eventId);
    }
  
    @Patch(':eventId/public')
    @ApiOperation({ summary: 'Public формын талбаруудыг шинэчлэх' })
    @ApiParam({ name: 'eventId', type: Number })
    @ApiBody({
      type: [EventFormField],
      description: 'Public формд харуулах шинэ талбаруудын массив',
      examples: {
        example1: {
          summary: 'Жишээ public талбарууд',
          value: [
            {
              label: 'Овог',
              type: 'string',
              required: true,
            },
            {
              label: 'Нэр',
              type: 'string',
              required: true,
            },
            {
              label: 'Утасны дугаар',
              type: 'string',
              required: true
            },
            {
              label: 'Имэйл хаяг',
              type: 'email',
              required: true
            },
          ],
        },
      },
    })
    @ApiResponse({ status: 200, description: 'Шинэчилсэн public форм буцаана' })
    updatePublicFields(
      @Param('eventId') eventId: number,
      @Body() fields: Partial<EventFormField>[],
    ) {
      return this.eventFormService.updatePublicFields(eventId, fields);
    }
    
    @Patch(':eventId/rsvp')
    @ApiOperation({ summary: 'RSVP формын талбаруудыг шинэчлэх' })
    @ApiParam({ name: 'eventId', type: Number })
    @ApiBody({
      type: [EventFormField],
      description: 'RSVP формын шинэ талбаруудын массив',
      examples: {
        example1: {
          summary: 'Жишээ RSVP талбарууд',
          value: [
            {
              label: 'Ирэх эсэх',
              type: 'radio',
              required: true,
              options: ['Тийм', 'Үгүй'],
            },
            {
              label: 'Дагалдан ирэх хүн байгаа юу?',
              type: 'checkbox',
              required: false,
              options: ['Нэг хүн', 'Хоёр хүн'],
            },
          ],
        },
      },
    })
    @ApiResponse({ status: 200, description: 'Шинэчилсэн rsvp форм буцаана' })
    updateRsvpFields(
      @Param('eventId') eventId: number,
      @Body() fields: Partial<EventFormField>[],
    ) {
      return this.eventFormService.updateRsvpFields(eventId, fields);
    }    
}
  