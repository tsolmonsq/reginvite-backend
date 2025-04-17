import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InvitationTemplate } from './entities/invitation-template.entity';
import { Repository } from 'typeorm';
import { CreateInvitationTemplateDto } from './dto/create-invitation-template.dto';
import { UpdateInvitationTemplateDto } from './dto/update-invitation-template.dto';

@Injectable()
export class InvitationTemplateService {
  constructor(
    @InjectRepository(InvitationTemplate)
    private templateRepo: Repository<InvitationTemplate>,
  ) {}

  async create(dto: CreateInvitationTemplateDto) {
    const template = this.templateRepo.create(dto);
    return this.templateRepo.save(template);
  }

  async update(id: number, dto: UpdateInvitationTemplateDto) {
    const existing = await this.templateRepo.findOneBy({ id });
    if (!existing) {
      throw new Error('Template not found');
    }
    Object.assign(existing, dto);
    return this.templateRepo.save(existing);
  }
  
  async findAll() {
    return this.templateRepo.find();
  }

  async findOne(id: number) {
    return this.templateRepo.findOneBy({ id });
  }
}
