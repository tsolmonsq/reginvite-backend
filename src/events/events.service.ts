import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Event } from './event.entity';
import { Organizer } from '../organizers/organizer.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InvitationTemplate } from 'src/invitation-template/entities/invitation-template.entity';
import { Template } from 'src/invitation-template/entities/template.entity';
import { EventFormService } from 'src/event-form/event-form.service';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepo: Repository<Event>,
    @InjectRepository(Organizer)
    private readonly organizerRepo: Repository<Organizer>,
    @InjectRepository(InvitationTemplate)
    private readonly invitationTemplateRepo: Repository<InvitationTemplate>,
    @InjectRepository(Template)
    private readonly templateRepo: Repository<Template>,
    private readonly formService: EventFormService,
  ) {}

  async create(dto: CreateEventDto, imagePath: string, organizerId: number) {
    const organizer = await this.organizerRepo.findOneBy({ id: organizerId });
    if (!organizer) throw new NotFoundException('Organizer олдсонгүй');

    let invitationTemplate: InvitationTemplate | undefined = undefined;

    if (dto.templateId) {
      const baseTemplate = await this.templateRepo.findOneBy({ id: dto.templateId });
      if (!baseTemplate) throw new NotFoundException('Template олдсонгүй');

      invitationTemplate = this.invitationTemplateRepo.create({
        baseTemplate,
        font: 'Arial',
        color: '#ec4899',
        show_qr: true,
        show_rsvp: true,
      });
    }

    const event = this.eventRepo.create({
      ...dto,
      imagePath,
      organizer,
      invitationTemplate,
    });

    const savedEvent = await this.eventRepo.save(event);
    await this.formService.createForEvent(savedEvent.id);

    return savedEvent;
  }

  async findOne(id: number, userId: number) {
    const event = await this.eventRepo.findOne({
      where: { id },
      relations: [
        'organizer',
        'organizer.user',
        'invitationTemplate',
        'invitationTemplate.baseTemplate',
      ],
    });

    if (!event) throw new NotFoundException('Арга хэмжээ олдсонгүй');
    if (String(event.organizer.user.id) !== String(userId)) {
      throw new ForbiddenException('Энэ арга хэмжээг үзэх эрхгүй');
    }

    return event;
  }

  async findAllByOrganizerId(
    organizerId: number,
    search: string = '',
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.eventRepo.findAndCount({
      where: {
        organizer: { id: organizerId },
        ...(search ? { title: ILike(`%${search}%`) } : {}),
      },
      relations: ['organizer'],
      skip,
      take: limit,
      order: { created_at: 'DESC' },
    });

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

  async update(
    id: number,
    dto: UpdateEventDto,
    userId: number,
    imagePath?: string,
  ) {
    const event = await this.findOne(id, userId);

    if (dto.templateId) {
      const baseTemplate = await this.templateRepo.findOneBy({ id: dto.templateId });
      if (!baseTemplate) throw new NotFoundException('Template олдсонгүй');

      const defaultFont = 'Arial';
      const defaultColor = '#ec4899';
      const defaultShowQR = true;
      const defaultShowRSVP = true;

      if (!event.invitationTemplate) {
        const newTemplate = this.invitationTemplateRepo.create({
          baseTemplate,
          font: defaultFont,
          color: defaultColor,
          show_qr: defaultShowQR,
          show_rsvp: defaultShowRSVP,
        });
        event.invitationTemplate = newTemplate;
      } else {
        event.invitationTemplate.baseTemplate = baseTemplate;
        event.invitationTemplate.font = defaultFont;
        event.invitationTemplate.color = defaultColor;
        event.invitationTemplate.show_qr = defaultShowQR;
        event.invitationTemplate.show_rsvp = defaultShowRSVP;
      }
    }

    Object.assign(event, dto);
    if (imagePath) event.imagePath = imagePath;

    return this.eventRepo.save(event);
  }

  async remove(id: number, userId: number) {
    const event = await this.findOne(id, userId);
    return this.eventRepo.remove(event);
  }
}
