import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organizer } from './entities/organizer.entity';

@Injectable()
export class OrganizersService {
  constructor(
    @InjectRepository(Organizer)
    private readonly organizerRepo: Repository<Organizer>,
  ) {}

  async findByUserId(userId: string) {
    const organizer = await this.organizerRepo.findOne({
      where: {
        user: {
          id: userId,
        },
      },
      relations: ['user'],
    });
  
    if (!organizer) throw new NotFoundException('Organizer олдсонгүй');
    return organizer;
  }  
}