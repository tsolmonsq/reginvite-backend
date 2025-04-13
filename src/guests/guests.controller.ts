import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GuestsService } from './guests.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { ApiTags, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

const allowedStatuses = ['New', 'By form', 'Sent', 'Pending', 'Failed'] as const;
type GuestStatus = typeof allowedStatuses[number];

@ApiBearerAuth('access-token')
@ApiTags('Guests')
@UseGuards(JwtAuthGuard)
@Controller('guests')
export class GuestsController {
  constructor(private readonly guestsService: GuestsService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Амжилттай бүртгэгдлээ' })
  create(@Body() createGuestDto: CreateGuestDto) {
    return this.guestsService.create(createGuestDto);
  }

  @Get()
  @ApiQuery({ name: 'eventId', required: true})
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: allowedStatuses,
    example: 'New',
  })
  findAll(
    @Query('eventId') eventId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search: string = '',
    @Query('status') status: string = 'New'
  ) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
  
    const normalizedStatus: GuestStatus | undefined =
      allowedStatuses.includes(status as GuestStatus) ? (status as GuestStatus) : undefined;
  
    return this.guestsService.findAllByEvent(+eventId, pageNum, limitNum, search, normalizedStatus);
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.guestsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateGuestDto: UpdateGuestDto) {
    return this.guestsService.update(+id, updateGuestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.guestsService.remove(+id);
  }
}
