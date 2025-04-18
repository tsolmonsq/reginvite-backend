import {
    Controller,
    Get,
    Patch,
    Param,
    Body,
  } from '@nestjs/common';
  import { EventFormService } from './event-form.service';
  import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
  import { EventFormField } from './entities/event-form-field.entity';
  
  @ApiTags('Event Form') 
  @Controller('event-forms')
  export class EventFormController {
    constructor(private readonly formService: EventFormService) {}
  
    @Get(':eventId')
    @ApiOperation({ summary: 'Эвентийн форм татах' })
    @ApiParam({ name: 'eventId', type: Number })
    @ApiResponse({ status: 200, description: 'Формын бүтэц буцаана' })
    async getForm(@Param('eventId') eventId: number) {
      return this.formService.getByEvent(eventId);
    }
  
    @Patch(':eventId')
    @ApiOperation({ summary: 'Формын талбарууд шинэчлэх' })
    @ApiParam({ name: 'eventId', type: Number })
    @ApiBody({
      type: [EventFormField],
      description: 'Шинэ форм талбаруудын массив',
      examples: {
        example1: {
          summary: 'Жишээ формын талбарууд',
          value: [
            {
              label: 'Нас',
              type: 'number',
              required: true,
            },
            {
              label: 'Имэйл хаяг',
              type: 'email',
              required: false,
            },
            {
              label: 'Хүйс',
              type: 'radio',
              required: true,
              options: ['Эрэгтэй', 'Эмэгтэй']
            },
            {
              label: 'Хобби',
              type: 'checkbox',
              required: false,
              options: ['Унших', 'Аялал', 'Спорт']
            }
          ],
        },
      },
    })
    @ApiResponse({ status: 200, description: 'Шинэчилсэн форм буцаана' })
    async updateFields(
      @Param('eventId') eventId: number,
      @Body() fields: Partial<EventFormField>[],
    ) {
      return this.formService.updateFields(eventId, fields);
    }
}
  