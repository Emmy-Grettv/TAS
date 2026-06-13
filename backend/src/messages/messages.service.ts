import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageLog } from './entities/message-log.entity';
import { CustomersService } from '../customers/customers.service';
import { UsersService } from '../users/users.service';
import { BulkSendDto } from './dto/bulk-send.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessageLog)
    private messageLogsRepo: Repository<MessageLog>,
    private customersService: CustomersService,
    private usersService: UsersService,
  ) {}

  async getStats() {
    const total = await this.messageLogsRepo.count({ where: { status: 'sent' as any } });
    return { totalSent: total };
  }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await this.messageLogsRepo.findAndCount({
      relations: ['customer', 'sentBy'],
      order: { sentAt: 'DESC' },
      skip,
      take: limit,
    });
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async bulkSend(dto: BulkSendDto, currentUserId: string) {
    const user = await this.usersService.findOne(currentUserId);
    const results: { customerId: string; status: string; error?: string }[] = [];

    for (const customerId of dto.customerIds) {
      try {
        const customer = await this.customersService.findOne(customerId);
        const log = await this.customersService.sendWhatsApp(
          customer,
          user,
          dto.customMessage,
        );
        results.push({ customerId, status: log.status });
      } catch (err) {
        results.push({ customerId, status: 'failed', error: err?.message });
      }

      // Delay between sends to respect WhatsApp rate limits
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }

    const sent = results.filter((r) => r.status === 'sent').length;
    const failed = results.filter((r) => r.status === 'failed').length;

    return { results, summary: { sent, failed, total: results.length } };
  }
}
