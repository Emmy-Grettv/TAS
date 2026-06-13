"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const customers_module_1 = require("./customers/customers.module");
const messages_module_1 = require("./messages/messages.module");
const whatsapp_module_1 = require("./whatsapp/whatsapp.module");
const bookings_module_1 = require("./bookings/bookings.module");
const user_entity_1 = require("./users/entities/user.entity");
const customer_entity_1 = require("./customers/entities/customer.entity");
const message_log_entity_1 = require("./messages/entities/message-log.entity");
const booking_entity_1 = require("./bookings/entities/booking.entity");
const quotations_module_1 = require("./quotations/quotations.module");
const quotation_entity_1 = require("./quotations/entities/quotation.entity");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', 'assets'),
                serveRoot: '/assets',
            }, {
                rootPath: (0, path_1.join)(__dirname, '..', 'uploads'),
                serveRoot: '/uploads',
            }),
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DB_HOST', 'localhost'),
                    port: configService.get('DB_PORT', 5432),
                    username: configService.get('DB_USER', 'postgres'),
                    password: configService.get('DB_PASS', ''),
                    database: configService.get('DB_NAME', 'tas_db'),
                    entities: [user_entity_1.User, customer_entity_1.Customer, message_log_entity_1.MessageLog, booking_entity_1.Booking, quotation_entity_1.Quotation],
                    synchronize: true,
                    logging: configService.get('NODE_ENV') === 'development',
                }),
                inject: [config_1.ConfigService],
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            customers_module_1.CustomersModule,
            messages_module_1.MessagesModule,
            whatsapp_module_1.WhatsappModule,
            bookings_module_1.BookingsModule,
            quotations_module_1.QuotationsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map