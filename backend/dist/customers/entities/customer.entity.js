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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Customer = exports.ContactTitle = exports.CustomerCategory = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const message_log_entity_1 = require("../../messages/entities/message-log.entity");
var CustomerCategory;
(function (CustomerCategory) {
    CustomerCategory["INFANT"] = "Infant";
    CustomerCategory["ECD"] = "ECD";
    CustomerCategory["PRIMARY"] = "Primary";
})(CustomerCategory || (exports.CustomerCategory = CustomerCategory = {}));
var ContactTitle;
(function (ContactTitle) {
    ContactTitle["MR"] = "Mr";
    ContactTitle["MISS"] = "Miss";
    ContactTitle["MRS"] = "Mrs";
    ContactTitle["MUM"] = "Mum";
    ContactTitle["MADAM"] = "Madam";
})(ContactTitle || (exports.ContactTitle = ContactTitle = {}));
let Customer = class Customer {
    id;
    schoolName;
    category;
    telephone;
    title;
    contactPerson;
    districtArea;
    observations;
    createdBy;
    updatedBy;
    messageLogs;
    createdAt;
    updatedAt;
};
exports.Customer = Customer;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Customer.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200 }),
    __metadata("design:type", String)
], Customer.prototype, "schoolName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: CustomerCategory }),
    __metadata("design:type", String)
], Customer.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 30 }),
    __metadata("design:type", String)
], Customer.prototype, "telephone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ContactTitle }),
    __metadata("design:type", String)
], Customer.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 150 }),
    __metadata("design:type", String)
], Customer.prototype, "contactPerson", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 150 }),
    __metadata("design:type", String)
], Customer.prototype, "districtArea", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "observations", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.createdCustomers, { eager: true, nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'createdById' }),
    __metadata("design:type", user_entity_1.User)
], Customer.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { eager: true, nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'updatedById' }),
    __metadata("design:type", user_entity_1.User)
], Customer.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => message_log_entity_1.MessageLog, (log) => log.customer),
    __metadata("design:type", Array)
], Customer.prototype, "messageLogs", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Customer.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Customer.prototype, "updatedAt", void 0);
exports.Customer = Customer = __decorate([
    (0, typeorm_1.Entity)('customers')
], Customer);
//# sourceMappingURL=customer.entity.js.map