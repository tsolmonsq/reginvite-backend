import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { EventForm } from './entities/event-form.entity';
import { EventFormField } from './entities/event-form-field.entity';
import { Event } from 'src/events/entities/event.entity';
import { CreateGuestDto } from 'src/guests/dto/create-guest.dto';
import { Guest } from 'src/guests/entities/guest.entity';

@Injectable()
export class EventFormService {
  constructor(
    @InjectRepository(EventForm)
    private readonly formRepo: Repository<EventForm>,
    
    @InjectRepository(EventFormField)
    private readonly fieldRepo: Repository<EventFormField>,
    
    @InjectRepository(Event)
    private readonly eventRepo: Repository<Event>,

    @InjectRepository(Guest)
    private readonly guestRepo: Repository<Guest>,
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

  async createPublicGuest(dto: CreateGuestDto): Promise<Guest> {
    const event = await this.eventRepo.findOne({ where: { id: dto.eventId } });
    if (!event) throw new NotFoundException('Event not found');

    const form = await this.formRepo.findOne({
      where: { event: Equal(dto.eventId), type: Equal('public') },
    });

    if (!form){
      throw new NotFoundException('Public форм олдсонгүй');
    }

    if (!form.is_open) {
      throw new Error('Форм хаалттай байна');
    }

    if (form.close_at && new Date() > form.close_at) {
      throw new Error('Бүртгэлийн хугацаа дууссан байна');
    }

    if (form.max_guests) {
      const currentGuestCount = await this.guestRepo.count({
        where: {
          event: { id: dto.eventId },
          status: Equal('By form'),
        },
      });
  
      if (currentGuestCount >= form.max_guests) {
        throw new Error(`${form.max_guests}) зочин хүрсэн байна.`);
      }
    }  
  
    const guest = this.guestRepo.create({
      first_name: dto.first_name,
      last_name: dto.last_name,
      email: dto.email,
      phone: dto.phone,
      event,
      status: 'By form',
    });
  
    return this.guestRepo.save(guest);
  }

  async updateMaxGuests(eventId: number, maxGuests: number): Promise<EventForm> {
    const form = await this.formRepo.findOne({
      where: { event: Equal(eventId), type: Equal('public') },
    });
  
    if (!form) throw new NotFoundException('Public форм олдсонгүй');
  
    form.max_guests = maxGuests;
    return this.formRepo.save(form);
  }

  async updateSettings(eventId: number, data: { max_guests?: number; close_at?: string; is_open?: boolean }) {
    const form = await this.formRepo.findOne({
      where: { event: { id: eventId }, type: 'public' },
    });
    if (!form) throw new NotFoundException('Public форм олдсонгүй');
  
    const currentCount = await this.guestRepo.count({
      where: {
        event: { id: eventId },
        status: Equal('By form'),
      },
    });
  
    if (data.max_guests !== undefined && data.max_guests < currentCount) {
      throw new Error(`Одоогоор ${currentCount} зочин бүртгэгдсэн тул maxGuests ${currentCount}-с бага байж болохгүй`);
    }
  
    if (data.close_at) {
      form.close_at = new Date(data.close_at);
    }
  
    if (data.max_guests !== undefined) {
      form.max_guests = data.max_guests;
    }
  
    if (data.is_open !== undefined) {
      form.is_open = data.is_open;
    }
  
    return this.formRepo.save(form);
  }  

  async getPublicFormStats(eventId: number) {
    const form = await this.formRepo.findOne({
      where: { event: { id: eventId }, type: 'public' },
    });
  
    if (!form) throw new NotFoundException('Public форм олдсонгүй');
  
    const registeredGuests = await this.guestRepo.count({
      where: {
        event: { id: eventId },
        status: Equal('By form'),
      },
    });
  
    return {
      formId: form.id,
      is_open: form.is_open,
      max_guests: form.max_guests ?? null,
      close_at: form.close_at ?? null,
      registered: registeredGuests,
    };
  }  
}
