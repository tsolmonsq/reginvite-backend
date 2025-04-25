import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Staff } from './entities/staff.entity';
import { CreateStaffDto } from './dto/create-staff.dto';
import { Organizer } from 'src/organizers/entities/organizer.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private staffRepo: Repository<Staff>,
    @InjectRepository(Organizer)
    private organizerRepo: Repository<Organizer>,
    private jwtService: JwtService,
  ) {}

  async create(dto: CreateStaffDto) {
    const organizer = await this.organizerRepo.findOne({ where: { id: +dto.organizerId } });
    if (!organizer) throw new NotFoundException('Organizer not found');

    const hashed = await bcrypt.hash(dto.password, 10);
    const staff = this.staffRepo.create({
      username: dto.username,
      password: hashed,
      organizer,
    });
    return this.staffRepo.save(staff);
  }

  async validateLogin(username: string, password: string) {
    const staff = await this.staffRepo.findOne({ where: { username }, relations: ['organizer'] });
    if (!staff || !(await bcrypt.compare(password, staff.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: staff.id,
      username: staff.username,
      role: 'staff',
      organizerId: staff.organizer.id,
    };

    const token = await this.jwtService.signAsync(payload);
    return { access_token: token };
  }

  async getStaffEvents(staffId: number) {
    const staff = await this.staffRepo.findOne({ where: { id: staffId }, relations: ['organizer'] });
    if (!staff) throw new NotFoundException();

    return staff.organizer.events;
  }
}
