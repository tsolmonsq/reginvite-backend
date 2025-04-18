import { TypeOrmModule } from '@nestjs/typeorm';
import { Organizer } from './entities/organizer.entity';
import { OrganizersService } from './organizers.service';
import { Module } from '@nestjs/common';

@Module ({
  imports: [TypeOrmModule.forFeature([Organizer])],
  providers: [OrganizersService],
  exports: [OrganizersService, TypeOrmModule],
})
export class OrganizersModule {}
