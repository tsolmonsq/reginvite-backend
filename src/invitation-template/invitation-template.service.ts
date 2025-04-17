import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InvitationTemplate } from './entities/invitation-template.entity';
import { Repository } from 'typeorm';
import { CreateInvitationTemplateDto } from './dto/create-invitation-template.dto';
import { UpdateInvitationTemplateDto } from './dto/update-invitation-template.dto';
import { Template } from './entities/template.entity';

@Injectable()
export class InvitationTemplateService {
  constructor(
    @InjectRepository(InvitationTemplate)
    private templateRepo: Repository<InvitationTemplate>,

    @InjectRepository(Template)
    private baseTemplateRepo: Repository<Template>
  ) {}

  async create(dto: CreateInvitationTemplateDto) {
    const { baseTemplateId, ...rest } = dto;

    const newTemplate = this.templateRepo.create({
      ...rest,
    });

    // baseTemplateId өгөгдсөн тохиолдолд Template-г холбоно
    if (baseTemplateId) {
      const baseTemplate = await this.baseTemplateRepo.findOne({
        where: { id: baseTemplateId },
      });

      if (!baseTemplate) {
        throw new Error(`Base Template with ID ${baseTemplateId} not found`);
      }

      newTemplate.baseTemplate = baseTemplate;
    }

    return this.templateRepo.save(newTemplate);
  }
  
  async update(id: number, dto: UpdateInvitationTemplateDto) {
    const existing = await this.templateRepo.findOne({
      where: { id },
      relations: ['baseTemplate'],
    });

    if (!existing) {
      throw new Error('InvitationTemplate not found');
    }

    if (dto.baseTemplateId) {
      const newBaseTemplate = await this.baseTemplateRepo.findOne({
        where: { id: dto.baseTemplateId },
      });

      if (!newBaseTemplate) {
        throw new Error(`Template with ID ${dto.baseTemplateId} not found`);
      }

      existing.baseTemplate = newBaseTemplate;
    }

    existing.font = dto.font ?? existing.font;
    existing.color = dto.color ?? existing.color;
    existing.show_qr = dto.show_qr ?? existing.show_qr;
    existing.show_rsvp = dto.show_rsvp ?? existing.show_rsvp;

    return this.templateRepo.save(existing);
  }
  
  async findAll() {
    return this.templateRepo.find();
  }

  async findOne(id: number) {
    return this.templateRepo.findOneBy({ id });
  }
}
