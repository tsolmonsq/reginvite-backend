import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { EventForm } from './event-form.entity';
import { EventFormField } from './event-form-field.entity';

@Injectable()
export class EventFormService {
  constructor(
    @InjectRepository(EventForm)
    private readonly formRepo: Repository<EventForm>,
    @InjectRepository(EventFormField)
    private readonly fieldRepo: Repository<EventFormField>,
  ) {}

  async createForEvent(eventId: number): Promise<EventForm> {
    const form = this.formRepo.create({ event: { id: eventId } as any });
    return this.formRepo.save(form);
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
    const form = await this.getByEvent(eventId);
    await this.fieldRepo.delete({ form: { id: form.id } });
    const newFields = fields.map((field) => this.fieldRepo.create({ ...field, form }));
    form.fields = await this.fieldRepo.save(newFields);
    return form;
  }
}