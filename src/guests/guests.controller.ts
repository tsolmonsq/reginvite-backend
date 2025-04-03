import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { GuestsService } from './guests.service';
import { Guest } from './guest.entity';

@Controller('guests')
export class GuestsController {
  constructor(private readonly guestsService: GuestsService) {}

  @Post()
  create(@Body() guest: Guest) {
    return this.guestsService.create(guest);
  }

  @Get()
  findAll() {
    return this.guestsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.guestsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() guest: Guest) {
    return this.guestsService.update(id, guest);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.guestsService.remove(id);
  }
}