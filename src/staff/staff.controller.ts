import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('Staff')
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post('register')
  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles('organizer')
  @ApiOperation({ summary: 'Register staff (Organizer only)' })
  @ApiBearerAuth()
  create(@Body() dto: CreateStaffDto) {
    return this.staffService.create(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Staff login to receive JWT token' })
  @ApiBody({
    schema: {
      example: {
        username: 'staffuser1',
        password: 'password123',
      },
    },
  })
  login(@Body() body: { username: string; password: string }) {
    return this.staffService.validateLogin(body.username, body.password);
  }

  @Get('events')
  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles('staff')
  @ApiOperation({ summary: 'Get events created by this staff’s organizer' })
  @ApiBearerAuth()
  getMyEvents(@Req() req: Request) {
    const staff = req.user as any;
    return this.staffService.getStaffEvents(staff.sub);
  }
}
