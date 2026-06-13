"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../app.module");
const users_service_1 = require("../users/users.service");
const user_entity_1 = require("../users/entities/user.entity");
async function seed() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const usersService = app.get(users_service_1.UsersService);
    const email = process.env.SEED_ADMIN_EMAIL || 'admin@tegano.com';
    const password = process.env.SEED_ADMIN_PASSWORD || 'Admin@123';
    const name = process.env.SEED_ADMIN_NAME || 'Administrator';
    const existing = await usersService.findByEmail(email);
    if (existing) {
        console.log(`✅ Admin already exists: ${email}`);
    }
    else {
        await usersService.create({ name, email, password, role: user_entity_1.UserRole.ADMIN });
        console.log(`🌱 Admin seeded: ${email} / ${password}`);
    }
    await app.close();
}
seed().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map