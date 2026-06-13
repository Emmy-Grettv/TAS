"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const customer_entity_1 = require("./entities/customer.entity");
const message_log_entity_1 = require("../messages/entities/message-log.entity");
const whatsapp_service_1 = require("../whatsapp/whatsapp.service");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let CustomersService = class CustomersService {
    customersRepo;
    messageLogsRepo;
    whatsappService;
    constructor(customersRepo, messageLogsRepo, whatsappService) {
        this.customersRepo = customersRepo;
        this.messageLogsRepo = messageLogsRepo;
        this.whatsappService = whatsappService;
    }
    buildQuery(query) {
        const qb = this.customersRepo
            .createQueryBuilder('customer')
            .leftJoinAndSelect('customer.createdBy', 'createdBy')
            .leftJoinAndSelect('customer.updatedBy', 'updatedBy')
            .orderBy('customer.createdAt', 'DESC');
        if (query.search) {
            qb.andWhere(`(customer.schoolName ILIKE :search OR customer.contactPerson ILIKE :search OR customer.telephone ILIKE :search OR customer.districtArea ILIKE :search)`, { search: `%${query.search}%` });
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
    async findAll(query) {
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
    async findAllForExport(query) {
        return this.buildQuery(query).getMany();
    }
    async findAllIds(query) {
        const rows = await this.buildQuery(query).select('customer.id').getMany();
        return rows.map((c) => c.id);
    }
    async findOne(id) {
        const customer = await this.customersRepo.findOne({
            where: { id },
            relations: ['createdBy', 'updatedBy', 'messageLogs', 'messageLogs.sentBy'],
        });
        if (!customer)
            throw new common_1.NotFoundException('Customer not found');
        return customer;
    }
    async create(dto, user) {
        const existing = await this.customersRepo.findOne({ where: { telephone: dto.telephone } });
        if (existing) {
            throw new common_1.ConflictException(`A customer with telephone number ${dto.telephone} already exists.`);
        }
        const customer = this.customersRepo.create({ ...dto, createdBy: user, updatedBy: user });
        const saved = await this.customersRepo.save(customer);
        await this.sendWhatsApp(saved, user, undefined);
        return this.findOne(saved.id);
    }
    async update(id, dto, user) {
        const customer = await this.findOne(id);
        if (dto.telephone && dto.telephone !== customer.telephone) {
            const existing = await this.customersRepo.findOne({ where: { telephone: dto.telephone } });
            if (existing) {
                throw new common_1.ConflictException(`A customer with telephone number ${dto.telephone} already exists.`);
            }
        }
        Object.assign(customer, dto, { updatedBy: user });
        await this.customersRepo.save(customer);
        return this.findOne(id);
    }
    async remove(id) {
        const customer = await this.findOne(id);
        await this.customersRepo.remove(customer);
        return { message: 'Customer deleted successfully' };
    }
    async sendWhatsApp(customer, user, customMessage) {
        const message = this.whatsappService.buildMessage(customer, customMessage);
        let status = message_log_entity_1.MessageStatus.SENT;
        let errorMessage;
        try {
            const flyerPath = path.join(__dirname, '..', '..', 'assets', 'flyer.jpg');
            const attachFlyer = !customMessage && fs.existsSync(flyerPath);
            await this.whatsappService.sendMessage(customer.telephone, message, attachFlyer);
        }
        catch (err) {
            status = message_log_entity_1.MessageStatus.FAILED;
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
};
exports.CustomersService = CustomersService;
exports.CustomersService = CustomersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __param(1, (0, typeorm_1.InjectRepository)(message_log_entity_1.MessageLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        whatsapp_service_1.WhatsappService])
], CustomersService);
//# sourceMappingURL=customers.service.js.map