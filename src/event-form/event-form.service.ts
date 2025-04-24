import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { EventForm } from './entities/event-form.entity';
import { EventFormField } from './entities/event-form-field.entity';
import { Event } from 'src/events/entities/event.entity';

@Injectable()
export class EventFormService {
  constructor(
    @InjectRepository(EventForm)
    private readonly formRepo: Repository<EventForm>,
    
    @InjectRepository(EventFormField)
    private readonly fieldRepo: Repository<EventFormField>,
    
    @InjectRepository(Event)
    private readonly eventRepo: Repository<Event>,
  ) {}

  async createForEvent(eventId: number) {
    const event = await this.eventRepo.findOne({ where: { id: eventId } });
    if (!event) throw new Error('Event not found');

    const form = this.formRepo.create({ event: { id: event.id } });
    const savedForm = await this.formRepo.save(form);

    const defaultFields: Partial<EventFormField>[] = [
      { label: 'Овог', type: 'text', required: true },
      { label: 'Нэр', type: 'text', required: true },
      { label: 'Имэйл хаяг', type: 'email', required: true },
      { label: 'Утасны дугаар', type: 'text', required: true },
    ];

    const fieldEntities = defaultFields.map((field) =>
      this.fieldRepo.create({ ...field, form: savedForm })
    );
    await this.fieldRepo.save(fieldEntities);

    return savedForm;
  }

  async getByEvent(eventId: number): Promise<EventForm> {
    const form = await this.formRepo.findOne({
      where: { event: Equal(eventId) },
      relations: ['fields'],
    });

    if (!form) {
      throw new NotFoundException('Тухайн эвентийн форм олдсонгүй');
    }

    return form;
  }

  async updateFields(eventId: number, fields: Partial<EventFormField>[]): Promise<EventForm> {
    let form = await this.formRepo.findOne({
      where: { event: Equal(eventId) },
      relations: ['fields'],
    });
  
    if (!form) {
      form = await this.createForEvent(eventId); 
    }
  
    await this.fieldRepo.delete({ form: { id: form.id } });
  
    const newFields = fields.map((field) =>
      this.fieldRepo.create({ ...field, form })
    );
  
    form.fields = await this.fieldRepo.save(newFields);
    return form;
  }  
}
