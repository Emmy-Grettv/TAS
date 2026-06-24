import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, UpdateBookingDto, BookingQueryDto, RejectBookingDto } from './dto/booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  // ─── Public endpoint (no auth) for the public-facing website ───
  @Post('public')
  createPublic(@Body() dto: CreateBookingDto) {
    return this.bookingsService.create(dto, null);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('stats')
  getStats() {
    return this.bookingsService.getStats();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll(@Query() query: BookingQueryDto, @Request() req) {
    // If not admin, restrict to their own bookings
    if (req.user.role !== UserRole.ADMIN) {
      query.createdById = req.user.id;
    }
    return this.bookingsService.findAll(query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Body() dto: CreateBookingDto, @Request() req) {
    return this.bookingsService.create(dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBookingDto) {
    return this.bookingsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingsService.remove(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post(':id/approve')
  approve(@Param('id') id: string) {
    return this.bookingsService.approve(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post(':id/reject')
  reject(@Param('id') id: string, @Body() dto: RejectBookingDto) {
    return this.bookingsService.reject(id, dto);
  }
}
