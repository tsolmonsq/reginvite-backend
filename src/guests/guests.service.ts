import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guest } from './guest.entity';

@Injectable()
export class GuestsService {
  constructor(
    @InjectRepository(Guest)
    private guestsRepository: Repository<Guest>,
  ) {}

  create(guest: Guest): Promise<Guest> {
    return this.guestsRepository.save(guest);
  }

  findAll(): Promise<Guest[]> {
    return this.guestsRepository.find();
  }

  async findOne(id: number): Promise<Guest> {
    const guest = await this.guestsRepository.findOne({
      where: { id }, // Use 'where' to specify the condition
    });

    if (!guest) {
      throw new NotFoundException(`Guest with id ${id} not found`);
    }

    return guest;
  }

  async update(id: number, guest: Guest): Promise<Guest> {
    await this.guestsRepository.update(id, guest);
    return this.findOne(id);
  }

  remove(id: number): Promise<void> {
    return this.guestsRepository.delete(id).then(() => undefined);
  }
}
