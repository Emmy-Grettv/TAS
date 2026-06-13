import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/entities/user.entity';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  const email = process.env.SEED_ADMIN_EMAIL || 'admin@tegano.com';
  const password = process.env.SEED_ADMIN_PASSWORD || 'Admin@123';
  const name = process.env.SEED_ADMIN_NAME || 'Administrator';

  const existing = await usersService.findByEmail(email);
  if (existing) {
    console.log(`✅ Admin already exists: ${email}`);
  } else {
    await usersService.create({ name, email, password, role: UserRole.ADMIN });
    console.log(`🌱 Admin seeded: ${email} / ${password}`);
  }

  await app.close();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
