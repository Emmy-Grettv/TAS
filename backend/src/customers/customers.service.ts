import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { MessageLog, MessageStatus } from '../messages/entities/message-log.entity';
import {
  CreateCustomerDto,
  UpdateCustomerDto,
  CustomerQueryDto,
} from './dto/customer.dto';
import { User } from '../users/entities/user.entity';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customersRepo: Repository<Customer>,
    @InjectRepository(MessageLog)
    private messageLogsRepo: Repository<MessageLog>,
    private whatsappService: WhatsappService,
  ) {}

  private buildQuery(query: CustomerQueryDto): SelectQueryBuilder<Customer> {
    const qb = this.customersRepo
      .createQueryBuilder('customer')
      .leftJoinAndSelect('customer.createdBy', 'createdBy')
      .leftJoinAndSelect('customer.updatedBy', 'updatedBy')
      .orderBy('customer.createdAt', 'DESC');

    if (query.search) {
      qb.andWhere(
        `(customer.schoolName ILIKE :search OR customer.contactPerson ILIKE :search OR customer.telephone ILIKE :search OR customer.districtArea ILIKE :search)`,
        { search: `%${query.search}%` },
      );
    }
    if (query.category) {
      qb.andWhere('customer.category = :category', { category: query.category });
    }
    if (query.districtArea) {
      qb.andWhere('customer.districtArea ILIKE :district', {
        district: `%${query.districtArea}%`,
      });
    }
    if (query.createdById) {
      qb.andWhere('createdBy.id = :userId', { userId: query.createdById });
    }
    if (query.dateFrom) {
      qb.andWhere('customer.createdAt >= :dateFrom', { dateFrom: new Date(query.dateFrom) });
    }
    if (query.dateTo) {
      const to = new Date(query.dateTo);
      to.setHours(23, 59, 59, 999);
      qb.andWhere('customer.createdAt <= :dateTo', { dateTo: to });
    }
    if (query.ids) {
      const idsArray = query.ids.split(',').filter((id) => id.trim() !== '');
      if (idsArray.length > 0) {
        qb.andWhere('customer.id IN (:...ids)', { ids: idsArray });
      }
    }
    return qb;
  }

  async findAll(query: CustomerQueryDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const qb = this.buildQuery(query);
    const [data, total] = await qb.skip(skip).take(limit).getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findAllForExport(query: CustomerQueryDto): Promise<Customer[]> {
    return this.buildQuery(query).getMany();
  }

  async findAllIds(query: CustomerQueryDto): Promise<string[]> {
    const rows = await this.buildQuery(query).select('customer.id').getMany();
    return rows.map((c) => c.id);
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.customersRepo.findOne({
      where: { id },
      relations: ['createdBy', 'updatedBy', 'messageLogs', 'messageLogs.sentBy'],
    });
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async create(dto: CreateCustomerDto, user: User): Promise<Customer> {
    const existing = await this.customersRepo.findOne({ where: { telephone: dto.telephone } });
    if (existing) {
      throw new ConflictException(`A customer with telephone number ${dto.telephone} already exists.`);
    }

    const customer = this.customersRepo.create({ ...dto, createdBy: user, updatedBy: user });
    const saved = await this.customersRepo.save(customer);

    // Auto send WhatsApp after creation
    await this.sendWhatsApp(saved, user, undefined);

    return this.findOne(saved.id);
  }

  async update(id: string, dto: UpdateCustomerDto, user: User): Promise<Customer> {
    const customer = await this.findOne(id);
    
    if (dto.telephone && dto.telephone !== customer.telephone) {
      const existing = await this.customersRepo.findOne({ where: { telephone: dto.telephone } });
      if (existing) {
        throw new ConflictException(`A customer with telephone number ${dto.telephone} already exists.`);
      }
    }

    Object.assign(customer, dto, { updatedBy: user });
    await this.customersRepo.save(customer);
    return this.findOne(id);
  }

  async remove(id: string): Promise<{ message: string }> {
    const customer = await this.findOne(id);
    await this.customersRepo.remove(customer);
    return { message: 'Customer deleted successfully' };
  }

  async sendWhatsApp(
    customer: Customer,
    user: User,
    customMessage?: string,
  ): Promise<MessageLog> {
    const message = this.whatsappService.buildMessage(customer, customMessage);
    let status = MessageStatus.SENT;
    let errorMessage: string | undefined;

    try {
      // Check if flyer exists locally before telling Twilio to use it
      const flyerPath = path.join(__dirname, '..', '..', 'assets', 'flyer.jpg');
      // Only attach flyer for the default welcome message (when customMessage is undefined)
      const attachFlyer = !customMessage && fs.existsSync(flyerPath);

      await this.whatsappService.sendMessage(customer.telephone, message, attachFlyer);
    } catch (err) {
      status = MessageStatus.FAILED;
      errorMessage = err?.message || 'Unknown error';
    }

    const log = this.messageLogsRepo.create({
      customer,
      message,
      status,
      errorMessage,
      sentBy: user,
    });
    return this.messageLogsRepo.save(log);
  }

  async getStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const [total, todayCount, monthCount] = await Promise.all([
      this.customersRepo.count(),
      this.customersRepo
        .createQueryBuilder('c')
        .where('c.createdAt >= :today', { today })
        .getCount(),
      this.customersRepo
        .createQueryBuilder('c')
        .where('c.createdAt >= :monthStart', { monthStart })
        .getCount(),
    ]);

    return { total, today: todayCount, thisMonth: monthCount };
  }
}
