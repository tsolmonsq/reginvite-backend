import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EventService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { OrganizersService } from '../organizers/organizers.service';
import { Express } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiTags,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';

@ApiBearerAuth('access-token')
@ApiTags('Events')
@UseGuards(JwtAuthGuard)
@Controller('events')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly organizerService: OrganizersService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = file.originalname.split('.').pop();
        cb(null, `${file.fieldname}-${uniqueSuffix}.${ext}`);
      },
    }),
  }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Event creation payload',
    type: CreateEventDto,
  })
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateEventDto,
    @Req() req: any,
  ) {
    const userId = req.user.id;
    const organizer = await this.organizerService.findByUserId(userId);
  
    const imagePath = file?.filename ? `uploads/${file.filename}` : "";
    console.log('✅ Final imagePath:', imagePath);
  
    return this.eventService.create(dto, imagePath, organizer.id);
  }  

  @Get()
  async findAll(@Req() req: any) {
    const userId = req.user.id;
    const organizer = await this.organizerService.findByUserId(userId);
    return this.eventService.findAllByOrganizerId(organizer.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.eventService.findOne(id, req.user.id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Event update payload',
    type: UpdateEventDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UpdateEventDto,
    @Req() req: any,
  ) {
    return this.eventService.update(id, dto, req.user.id, file?.path);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.eventService.remove(id, req.user.id);
  }
}
