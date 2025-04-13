import { Module } from '@nestjs/common';
import { GuestsService } from './guests.service';
import { GuestsController } from './guests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guest } from './guest.entity';
import { Event } from 'src/events/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Guest, Event])],
  controllers: [GuestsController],
  providers: [GuestsService],
  exports: [GuestsService],
})
export class GuestsModule {}
