import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';
import { Customer } from '../customers/entities/customer.entity';

@Injectable()
export class WhatsappService {
  private twilioClient: Twilio;
  private readonly twilioNumber: string;
  private readonly publicAppUrl: string;
  private readonly logger = new Logger(WhatsappService.name);

  constructor(private configService: ConfigService) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID', '');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN', '');
    this.twilioNumber = this.configService.get<string>('TWILIO_WHATSAPP_NUMBER', '');
    this.publicAppUrl = this.configService.get<string>('PUBLIC_APP_URL', 'http://localhost:3001');

    if (accountSid && authToken) {
      this.twilioClient = new Twilio(accountSid, authToken);
    }
  }

  private getGreeting(): string {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  buildMessage(customer: Customer, customMessage?: string): string {
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

  async sendMessage(
    to: string,
    message: string,
    attachFlyer?: boolean,
    mediaUrls?: string[],
  ): Promise<{ messageId: string }> {
    if (!this.twilioClient) {
      this.logger.warn('Twilio client is not initialized. Check your TWILIO credentials. Simulating success.');
      return { messageId: 'mock-id-' + Date.now() };
    }

    const phone = to.replace(/\D/g, '');
    const normalizedPhone = phone.startsWith('0') ? `263${phone.slice(1)}` : phone;

    const payload: any = {
      from: this.twilioNumber.startsWith('whatsapp:') ? this.twilioNumber : `whatsapp:${this.twilioNumber}`,
      to: `whatsapp:+${normalizedPhone}`,
      body: message,
    };

    const isPublic = !this.publicAppUrl.includes('localhost') && !this.publicAppUrl.includes('127.0.0.1');

    if (attachFlyer) {
      if (isPublic) {
        payload.mediaUrl = payload.mediaUrl || [];
        payload.mediaUrl.push(`${this.publicAppUrl}/assets/flyer.jpg`);
      } else {
        this.logger.warn('Skipping flyer attachment — PUBLIC_APP_URL is not public.');
      }
    }

    if (mediaUrls && mediaUrls.length > 0) {
      if (isPublic) {
        payload.mediaUrl = payload.mediaUrl || [];
        payload.mediaUrl.push(...mediaUrls);
      } else {
        this.logger.warn('Skipping extra media attachments — PUBLIC_APP_URL is not public.');
      }
    }

    try {
      const response = await this.twilioClient.messages.create(payload);
      return { messageId: response.sid };
    } catch (error) {
      this.logger.error(`Failed to send Twilio message to ${normalizedPhone}`, error);
      throw error;
    }
  }
}
