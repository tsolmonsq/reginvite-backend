import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Guest } from './guest.entity';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { Event } from 'src/events/event.entity';
import { EmailService } from 'src/email/email.service';
import { InvitationTemplate } from 'src/invitation-template/invitation-template.entity';
import { QRCodeService } from 'src/qr/qr-code.service';

@Injectable()
export class GuestsService {
  constructor(
    @InjectRepository(Guest)
    private guestRepo: Repository<Guest>,

    @InjectRepository(Event)
    private eventRepo: Repository<Event>,
    
    @InjectRepository(InvitationTemplate) // 👈 add this
    private templateRepo: Repository<InvitationTemplate>,

    private emailService: EmailService,

    private qrCodeService: QRCodeService,
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

  async sendInvitations(
    guestIds: number[],
    templateId: number
  ) {
    const guests = await this.guestRepo.find({
      where: { id: In(guestIds) },
      relations: ['event'],
    });
  
    const template = await this.templateRepo.findOneBy({ id: templateId });
    if (!template) {
      throw new NotFoundException('Template not found');
    }
  
    for (const guest of guests) {
      try {
        const qrUrl = `http://localhost:3000/checkin/${guest.qr_token}`;
        const qrImage = await this.qrCodeService.generateDataURL(qrUrl); 
  
        const html = template.html
          .replaceAll('{{TITLE}}', guest.event.title || '')
          .replaceAll('{{DESCRIPTION}}', guest.event.description || '')
          .replaceAll('{{LOCATION}}', guest.event.location || '')
          .replaceAll('{{START_TIME}}', guest.event.start_time?.toLocaleString('mn-MN') || '')
          .replaceAll('{{END_TIME}}', guest.event.end_time?.toLocaleString('mn-MN') || '')
          .replaceAll('{{COLOR}}', template.color || '')
          .replaceAll('{{QR_SECTION}}', `<img src="${qrImage}" width="120" />`) 
  
        const subject = `Урилга: ${guest.event.title || 'Таны эвент'}`;
  
        await this.emailService.sendEmail(guest.email, subject, html);
  
      } catch (error) {
        console.error('EMAIL ERROR:', error); 
        await this.guestRepo.update(guest.id, { status: 'Failed' });
      }
    }
  
    return { message: 'Илгээх процесс амжилттай дууссан' };
  }  

  async findByToken(token: string) {
    return this.guestRepo.findOneBy({ qr_token: token });
  }

  update(id: number, updateGuestDto: UpdateGuestDto) {
    return this.guestRepo.update(id, updateGuestDto);
  }

  remove(id: number) {
    return this.guestRepo.delete(id);
  }
}
