import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvitationTemplate } from './entities/invitation-template.entity';
import { InvitationTemplateService } from './invitation-template.service';
import { InvitationTemplateController } from './invitation-template.controller';
import { Template } from '../template/entities/template.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InvitationTemplate, Template])], 
  controllers: [InvitationTemplateController],
  providers: [InvitationTemplateService],
  exports: [InvitationTemplateService], 
})
export class InvitationTemplateModule {}
