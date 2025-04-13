import { PartialType } from '@nestjs/mapped-types';
import { CreateInvitationTemplateDto } from './create-invitation-template.dto';

export class UpdateInvitationTemplateDto extends PartialType(CreateInvitationTemplateDto) {}
