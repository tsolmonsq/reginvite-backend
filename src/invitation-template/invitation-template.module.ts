import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvitationTemplate } from './invitation-template.entity';
import { InvitationTemplateService } from './invitation-template.service';
import { InvitationTemplateController } from './invitation-template.controller';

@Module({
  imports: [TypeOrmModule.forFeature([InvitationTemplate])], 
  controllers: [InvitationTemplateController],
  providers: [InvitationTemplateService],
  exports: [InvitationTemplateService], 
})
export class InvitationTemplateModule {}
