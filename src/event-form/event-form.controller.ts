import {
    Controller,
    Get,
    Patch,
    Param,
    Body,
    Query,
    Post,
  } from '@nestjs/common';
  import { EventFormService } from './event-form.service';
  import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
  import { EventFormField } from './entities/event-form-field.entity';
  import { ParseIntPipe } from '@nestjs/common';
import { CreateGuestDto } from 'src/guests/dto/create-guest.dto';
  
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

    @Post(':eventId/public-response')
    @ApiOperation({ summary: 'Public форм бөглөсөн зочныг бүртгэх' })
    @ApiBody({ type: CreateGuestDto })
    createPublicGuest(
      @Body() dto: CreateGuestDto,
    ) {
      return this.eventFormService.createPublicGuest(dto);
    }

    @Patch(':eventId/public/max-guests')
    @ApiOperation({ summary: 'Public формд зочдын дээд хэмжээ тохируулах' })
    @ApiParam({ name: 'eventId', type: Number })
    @ApiBody({
      schema: {
        type: 'object',
        properties: {
          maxGuests: {
            type: 'number',
            example: 100,
            description: 'Нийт бүртгэгдэх зочдын дээд тоо',
          },
        },
      },
    })
    @ApiResponse({ status: 200, description: 'maxGuests амжилттай шинэчлэгдлээ' })
    updateMaxGuests(
      @Param('eventId') eventId: number,
      @Body() body: { maxGuests: number },
    ) {
      return this.eventFormService.updateMaxGuests(eventId, body.maxGuests);
    }

    @Patch(':eventId/settings')
    updateFormSettings(
      @Param('eventId') eventId: number,
      @Body() body: { max_guests?: number; close_at?: string; is_open?: boolean }
    ) {
      return this.eventFormService.updateSettings(eventId, body);
    }

    @Get(':eventId/public/stats')
    @ApiOperation({ summary: 'Public формын статистик' })
    @ApiParam({ name: 'eventId', type: Number })
    @ApiResponse({ status: 200, description: 'Формын бүртгэлийн мэдээлэл' })
    getPublicStats(@Param('eventId', ParseIntPipe) eventId: number) {
      return this.eventFormService.getPublicFormStats(eventId);
    }
}
  