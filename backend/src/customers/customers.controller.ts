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
import { CustomersService } from './customers.service';
import { CreateCustomerDto, UpdateCustomerDto, CustomerQueryDto } from './dto/customer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UsersService } from '../users/users.service';

@UseGuards(JwtAuthGuard)
@Controller('customers')
export class CustomersController {
  constructor(
    private readonly customersService: CustomersService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  findAll(@Query() query: CustomerQueryDto) {
    return this.customersService.findAll(query);
  }

  @Get('stats')
  getStats() {
    return this.customersService.getStats();
  }

  @Get('export')
  exportAll(@Query() query: CustomerQueryDto) {
    return this.customersService.findAllForExport(query);
  }

  @Get('ids')
  findIds(@Query() query: CustomerQueryDto) {
    return this.customersService.findAllIds(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreateCustomerDto, @CurrentUser() currentUser: any) {
    const user = await this.usersService.findOne(currentUser.sub);
    return this.customersService.create(dto, user);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCustomerDto,
    @CurrentUser() currentUser: any,
  ) {
    const user = await this.usersService.findOne(currentUser.sub);
    return this.customersService.update(id, dto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customersService.remove(id);
  }

  @Post(':id/send-whatsapp')
  async sendWhatsApp(
    @Param('id') id: string,
    @Body('message') customMessage: string,
    @CurrentUser() currentUser: any,
  ) {
    const user = await this.usersService.findOne(currentUser.sub);
    const customer = await this.customersService.findOne(id);
    return this.customersService.sendWhatsApp(customer, user, customMessage);
  }
}
