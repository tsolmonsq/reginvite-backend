import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guest } from './guest.entity';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { Event } from 'src/events/event.entity';

@Injectable()
export class GuestsService {
  constructor(
    @InjectRepository(Guest)
    private guestRepo: Repository<Guest>,

    @InjectRepository(Event)
    private eventRepo: Repository<Event>,
  ) {}

  async create(createGuestDto: CreateGuestDto) {
    const event = await this.eventRepo.findOneBy({ id: createGuestDto.eventId });
  
    if (!event) {
      throw new NotFoundException('Event not found');
    }
  
    const guest = this.guestRepo.create({
      ...createGuestDto,
      event,
    });
  
    return this.guestRepo.save(guest);
  }

  async findAllByEvent(
    eventId: number,
    page = 1,
    limit = 20,
    search = '',
    status?: 'New' | 'By form' | 'Sent' | 'Pending' | 'Failed'
  ) {
    const query = this.guestRepo
      .createQueryBuilder('guest')
      .leftJoinAndSelect('guest.event', 'event')
      .where('event.id = :eventId', { eventId });
  
    if (search) {
      query.andWhere(
        `(guest.first_name ILIKE :search OR guest.last_name ILIKE :search OR guest.email ILIKE :search OR guest.phone ILIKE :search)`,
        { search: `%${search}%` },
      );
    }
  
    if (status) {
      query.andWhere('guest.status = :status', { status });
    }
  
    query.orderBy('guest.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);
  
    const [data, total] = await query.getManyAndCount();
  
    const totalPages = Math.ceil(total / limit);
  
    return {
      data,
      meta: {
        total,
        page,
        limit,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
        totalPages,
      },
    };
  }  

  findOne(id: number) {
    return this.guestRepo.findOneBy({ id });
  }

  update(id: number, updateGuestDto: UpdateGuestDto) {
    return this.guestRepo.update(id, updateGuestDto);
  }

  remove(id: number) {
    return this.guestRepo.delete(id);
  }
}
