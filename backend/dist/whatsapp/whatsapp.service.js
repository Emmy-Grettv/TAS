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
var WhatsappService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsappService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const twilio_1 = require("twilio");
let WhatsappService = WhatsappService_1 = class WhatsappService {
    configService;
    twilioClient;
    twilioNumber;
    publicAppUrl;
    logger = new common_1.Logger(WhatsappService_1.name);
    constructor(configService) {
        this.configService = configService;
        const accountSid = this.configService.get('TWILIO_ACCOUNT_SID', '');
        const authToken = this.configService.get('TWILIO_AUTH_TOKEN', '');
        this.twilioNumber = this.configService.get('TWILIO_WHATSAPP_NUMBER', '');
        this.publicAppUrl = this.configService.get('PUBLIC_APP_URL', 'http://localhost:3001');
        if (accountSid && authToken) {
            this.twilioClient = new twilio_1.Twilio(accountSid, authToken);
        }
    }
    getGreeting() {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12)
            return 'Good morning';
        if (hour >= 12 && hour < 17)
            return 'Good afternoon';
        return 'Good evening';
    }
    buildMessage(customer, customMessage) {
        if (customMessage) {
            return customMessage
                .replace('{Title}', customer.title)
                .replace('{Contact Person}', customer.contactPerson)
                .replace('{School Name}', customer.schoolName)
                .replace('{Greeting}', this.getGreeting());
        }
        const greeting = this.getGreeting();
        return `${greeting} ${customer.title} ${customer.contactPerson},

Thank you for warmly welcoming *Tegano Recreation Center* during our recent visit to *${customer.schoolName}* and for showing interest in our School Winter Promotion Packages.

We truly appreciate your positive response and your intention to visit our recreation center. We are excited and look forward to hosting your learners for a fun, safe, and memorable winter experience.

Please find our promotional flyer attached for more details.

For bookings or further arrangements, please feel free to contact us anytime.

Kind regards,

*The Management*
*Tegano Recreation Center*`;
    }
    async sendMessage(to, message, attachFlyer, mediaUrls) {
        if (!this.twilioClient) {
            this.logger.warn('Twilio client is not initialized. Check your TWILIO credentials. Simulating success.');
            return { messageId: 'mock-id-' + Date.now() };
        }
        const phone = to.replace(/\D/g, '');
        const normalizedPhone = phone.startsWith('0') ? `263${phone.slice(1)}` : phone;
        const payload = {
            from: this.twilioNumber.startsWith('whatsapp:') ? this.twilioNumber : `whatsapp:${this.twilioNumber}`,
            to: `whatsapp:+${normalizedPhone}`,
            body: message,
        };
        const isPublic = !this.publicAppUrl.includes('localhost') && !this.publicAppUrl.includes('127.0.0.1');
        if (attachFlyer) {
            if (isPublic) {
                payload.mediaUrl = payload.mediaUrl || [];
                payload.mediaUrl.push(`${this.publicAppUrl}/assets/flyer.jpg`);
            }
            else {
                this.logger.warn('Skipping flyer attachment — PUBLIC_APP_URL is not public.');
            }
        }
        if (mediaUrls && mediaUrls.length > 0) {
            if (isPublic) {
                payload.mediaUrl = payload.mediaUrl || [];
                payload.mediaUrl.push(...mediaUrls);
            }
            else {
                this.logger.warn('Skipping extra media attachments — PUBLIC_APP_URL is not public.');
            }
        }
        try {
            const response = await this.twilioClient.messages.create(payload);
            return { messageId: response.sid };
        }
        catch (error) {
            this.logger.error(`Failed to send Twilio message to ${normalizedPhone}`, error);
            throw error;
        }
    }
};
exports.WhatsappService = WhatsappService;
exports.WhatsappService = WhatsappService = WhatsappService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], WhatsappService);
//# sourceMappingURL=whatsapp.service.js.map