import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { GuestsService } from './guests.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { ApiTags, ApiResponse, ApiQuery, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { SendInviteDto } from './dto/send-invites.dto';
import { UseInterceptors, UploadedFile, BadRequestException,} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ImportGuestExcelDto } from './dto/import-excel.dto';
import * as xlsx from 'xlsx';
import * as fs from 'fs';


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
  @ApiQuery({ name: 'eventId', required: true })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: allowedStatuses,
  })
  findAll(
    @Query('eventId') eventId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search: string = '',
    @Query('status') status?: string, 
  ) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
  
    const normalizedStatus: GuestStatus | undefined =
      allowedStatuses.includes(status as GuestStatus)
        ? (status as GuestStatus)
        : undefined;
  
    return this.guestsService.findAllByEvent(+eventId, pageNum, limitNum, search, normalizedStatus);
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.guestsService.findOne(+id);
  }

  @Post('send-invites')
  @ApiResponse({ status: 201, description: 'Илгээх амжилттай' })
  async sendInvites(@Body() dto: SendInviteDto) {
    return this.guestsService.sendInvitations(dto.guestIds, dto.templateId);
  }

  @Post('/checkin/:token')
  async checkInGuestPost(@Param('token') token: string) {
    return this.guestsService.checkInByToken(token);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateGuestDto: UpdateGuestDto) {
    return this.guestsService.update(+id, updateGuestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.guestsService.remove(+id);
  }

  @Post('import-excel')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${unique}${extname(file.originalname)}`);
      },
    }),
  }))
  async importExcel(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: ImportGuestExcelDto,
  ) {
    if (!file) throw new BadRequestException('Файл илгээгдээгүй байна');

    const workbook = xlsx.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const rows: any[] = xlsx.utils.sheet_to_json(sheet);

    const errors: string[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!row.Овог || !row.Нэр || !row.Имэйл || !row.Утас) {
        errors.push(`Мөр ${i + 2} - мэдээлэл дутуу`);
        continue;
      }

      try {
        await this.guestsService.create({
          last_name: row.Овог,
          first_name: row.Нэр,
          email: row.Имэйл,
          phone: row.Утас,
          eventId: Number(body.eventId),
        });
      } catch (e) {
        errors.push(`Мөр ${i + 2} - алдаа: ${e.message}`);
      }
    }

    fs.unlinkSync(file.path);

    if (errors.length > 0) {
      throw new BadRequestException(`Алдаатай мөрүүд:\n${errors.join('\n')}`);
    }

    return { message: 'Excel файл амжилттай боловсруулав' };
  }
}
