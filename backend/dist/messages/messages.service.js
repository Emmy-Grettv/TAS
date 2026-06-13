"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const message_log_entity_1 = require("./entities/message-log.entity");
const customers_service_1 = require("../customers/customers.service");
const users_service_1 = require("../users/users.service");
let MessagesService = class MessagesService {
    messageLogsRepo;
    customersService;
    usersService;
    constructor(messageLogsRepo, customersService, usersService) {
        this.messageLogsRepo = messageLogsRepo;
        this.customersService = customersService;
        this.usersService = usersService;
    }
    async getStats() {
        const total = await this.messageLogsRepo.count({ where: { status: 'sent' } });
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
    async bulkSend(dto, currentUserId) {
        const user = await this.usersService.findOne(currentUserId);
        const results = [];
        for (const customerId of dto.customerIds) {
            try {
                const customer = await this.customersService.findOne(customerId);
                const log = await this.customersService.sendWhatsApp(customer, user, dto.customMessage);
                results.push({ customerId, status: log.status });
            }
            catch (err) {
                results.push({ customerId, status: 'failed', error: err?.message });
            }
            await new Promise((resolve) => setTimeout(resolve, 1500));
        }
        const sent = results.filter((r) => r.status === 'sent').length;
        const failed = results.filter((r) => r.status === 'failed').length;
        return { results, summary: { sent, failed, total: results.length } };
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(message_log_entity_1.MessageLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        customers_service_1.CustomersService,
        users_service_1.UsersService])
], MessagesService);
//# sourceMappingURL=messages.service.js.map