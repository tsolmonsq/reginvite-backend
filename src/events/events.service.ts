// --- event.service.ts ---
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { Organizer } from '../organizers/organizer.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepo: Repository<Event>,
    @InjectRepository(Organizer)
    private readonly organizerRepo: Repository<Organizer>,
  ) {}

  async create(dto: CreateEventDto, imagePath: string, organizerId: number) {
    const organizer = await this.organizerRepo.findOneBy({ id: organizerId });
    if (!organizer) {
      throw new NotFoundException('Organizer олдсонгүй');
    }
  
    const event = this.eventRepo.create({
      ...dto,
      imagePath,
      organizer, 
    });
  
    return this.eventRepo.save(event);
  }

  async findOne(id: number, userId: number) {
    const event = await this.eventRepo.findOne({
      where: { id },
      relations: ['organizer', 'organizer.user', 'template'], 
    });
    if (!event) throw new NotFoundException('Арга хэмжээ олдсонгүй');
    if (String(event.organizer.user.id) !== String(userId)) {
      throw new ForbiddenException('Энэ арга хэмжээг үзэх эрхгүй');
    }
    return event;
  }

  async findAllByOrganizerId(organizerId: number) {
    return this.eventRepo.find({
      where: { organizer: { id: organizerId } },
      relations: ['organizer'],
    });
  }  

  async update(id: number, dto: UpdateEventDto, userId: number, imagePath?: string) {
    const event = await this.findOne(id, userId);
    Object.assign(event, dto);
    if (imagePath) event.imagePath = imagePath;
    return this.eventRepo.save(event);
  }

  async remove(id: number, userId: number) {
    const event = await this.findOne(id, userId);
    return this.eventRepo.remove(event);
  }
}