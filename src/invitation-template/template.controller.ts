import { Controller, Get, Param } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { InjectRepository } from "@nestjs/typeorm";
import { Template } from "./entities/template.entity";
import { Repository } from "typeorm";

@ApiTags('Base Templates')
@Controller('base-templates') // ✔️ өөр endpoint
export class TemplateController {
  constructor(
    @InjectRepository(Template)
    private readonly templateRepo: Repository<Template>,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all base HTML templates' })
  findAll() {
    return this.templateRepo.find();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.templateRepo.findOneBy({ id });
  }
}
