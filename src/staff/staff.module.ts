import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Staff } from './entities/staff.entity';
import { Organizer } from 'src/organizers/entities/organizer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Staff, Organizer]),
    StaffModule,
  ],
  providers: [StaffService],
  controllers: [StaffController]
})
export class StaffModule {}
