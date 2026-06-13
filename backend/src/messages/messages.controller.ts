import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { BulkSendDto } from './dto/bulk-send.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('stats')
  getStats() {
    return this.messagesService.getStats();
  }

  @Get()
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return this.messagesService.findAll(page, limit);
  }

  @Post('bulk-send')
  bulkSend(@Body() dto: BulkSendDto, @CurrentUser() currentUser: any) {
    return this.messagesService.bulkSend(dto, currentUser.sub);
  }
}
