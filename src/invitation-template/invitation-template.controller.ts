import { Body, Controller, Get, Post, Param, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InvitationTemplateService } from './invitation-template.service';
import { CreateInvitationTemplateDto } from './dto/create-invitation-template.dto';
import { UpdateInvitationTemplateDto } from './dto/update-invitation-template.dto';

@ApiTags('Invitation Templates')
@Controller('invitation-templates')
export class InvitationTemplateController {
  constructor(private readonly templateService: InvitationTemplateService) {}

  @Post()
  @ApiOperation({ summary: 'Create new invitation template' })
  @ApiResponse({ status: 201, description: 'Template created' })
  create(@Body() dto: CreateInvitationTemplateDto) {
    return this.templateService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all templates' })
  findAll() {
    return this.templateService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one template by ID' })
  findOne(@Param('id') id: number) {
    return this.templateService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateInvitationTemplateDto) {
    return this.templateService.update(Number(id), dto);
  }
}
