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

  async createPublicForm(eventId: number): Promise<EventForm> {
    const event = await this.eventRepo.findOne({ where: { id: eventId } });
    if (!event) throw new NotFoundException('Event not found');

    const existing = await this.formRepo.findOne({ where: { event: Equal(eventId), type: Equal('public') } });
    if (existing) throw new Error('Public форм аль хэдийн үүссэн байна');

    const form = this.formRepo.create({ event, type: 'public' });
    const savedForm = await this.formRepo.save(form);

    const defaultFields: Partial<EventFormField>[] = [
      { label: 'Овог', type: 'text', required: true },
      { label: 'Нэр', type: 'text', required: true },
      { label: 'Имэйл хаяг', type: 'email', required: true },
      { label: 'Утасны дугаар', type: 'text', required: true },
    ];

    const fieldEntities = defaultFields.map(field =>
      this.fieldRepo.create({ ...field, form: savedForm }),
    );
    await this.fieldRepo.save(fieldEntities);

    return savedForm;
  }

  async createRsvpForm(eventId: number): Promise<EventForm> {
    const event = await this.eventRepo.findOne({ where: { id: eventId } });
    if (!event) throw new NotFoundException('Event not found');

    const existing = await this.formRepo.findOne({ where: { event: Equal(eventId), type: Equal('rsvp') } });
    if (existing) throw new Error('RSVP форм аль хэдийн үүссэн байна');

    const form = this.formRepo.create({ event, type: 'rsvp' });
    const savedForm = await this.formRepo.save(form);

    return savedForm;
  }

  async getPublicForm(eventId: number): Promise<EventForm> {
    let form = await this.formRepo.findOne({
      where: { event: Equal(eventId), type: Equal('public') },
      relations: ['fields'],
    });
  
    if (!form) {
      try {
        form = await this.createPublicForm(eventId);
      } catch (err) {
        throw new NotFoundException('Public форм үүсгэхэд алдаа гарлаа: ' + err.message);
      }
    }
  
    return form;
  }  

  async getRsvpForm(eventId: number): Promise<EventForm> {
    let form = await this.formRepo.findOne({
      where: { event: Equal(eventId), type: Equal('rsvp') },
      relations: ['fields'],
    });
  
    if (!form) {
      try {
        form = await this.createRsvpForm(eventId);
      } catch (err) {
        throw new NotFoundException('RSVP форм үүсгэхэд алдаа гарлаа: ' + err.message);
      }
    }
  
    return form;
  }

  async updatePublicFields(eventId: number, fields: Partial<EventFormField>[]): Promise<EventForm> {
    let form = await this.formRepo.findOne({
      where: { event: Equal(eventId), type: Equal('public') },
      relations: ['fields'],
    });
  
    if (!form) {
      throw new NotFoundException('Public форм олдсонгүй');
    }
  
    await this.fieldRepo.delete({ form: { id: form.id } });
  
    const newFields = fields.map((field) =>
      this.fieldRepo.create({ ...field, form }),
    );
  
    form.fields = await this.fieldRepo.save(newFields);
    return form;
  }
  
  async updateRsvpFields(eventId: number, fields: Partial<EventFormField>[]): Promise<EventForm> {
    let form = await this.formRepo.findOne({
      where: { event: Equal(eventId), type: Equal('rsvp') },
      relations: ['fields'],
    });
  
    if (!form) {
      throw new NotFoundException('RSVP форм олдсонгүй');
    }
  
    await this.fieldRepo.delete({ form: { id: form.id } });
  
    const newFields = fields.map((field) =>
      this.fieldRepo.create({ ...field, form }),
    );
  
    form.fields = await this.fieldRepo.save(newFields);
    return form;
  }  
}
