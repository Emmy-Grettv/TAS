import {
  Injectable,
  NotFoundException,
  ConflictException,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto, ResetPasswordDto } from './dto/user.dto';

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.seedDefaultAdmin();
  }

  async seedDefaultAdmin() {
    const email = process.env.SEED_ADMIN_EMAIL || 'admin@tegano.com';
    const password = process.env.SEED_ADMIN_PASSWORD || 'Admin@123';
    const name = process.env.SEED_ADMIN_NAME || 'Administrator';

    const existing = await this.findByEmail(email);
    if (!existing) {
      const hashed = await bcrypt.hash(password, 10);
      const user = this.usersRepo.create({
        name,
        email,
        password: hashed,
        role: UserRole.ADMIN,
      });
      await this.usersRepo.save(user);
      this.logger.log(`🌱 Default Admin seeded on deployment: ${email}`);
    } else {
      this.logger.log(`✅ Admin account ready: ${email}`);
    }
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.usersRepo.find({ order: { createdAt: 'DESC' } });
    return users.map(({ password, ...u }) => u as Omit<User, 'password'>);
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { email } });
  }

  async create(dto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const existing = await this.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already in use');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepo.create({ ...dto, password: hashed });
    const saved = await this.usersRepo.save(user);
    const { password, ...result } = saved;
    return result as Omit<User, 'password'>;
  }

  async update(id: string, dto: UpdateUserDto): Promise<Omit<User, 'password'>> {
    const user = await this.findOne(id);
    if (dto.email && dto.email !== user.email) {
      const existing = await this.findByEmail(dto.email);
      if (existing) throw new ConflictException('Email already in use');
    }
    Object.assign(user, dto);
    const saved = await this.usersRepo.save(user);
    const { password, ...result } = saved;
    return result as Omit<User, 'password'>;
  }

  async resetPassword(id: string, dto: ResetPasswordDto): Promise<{ message: string }> {
    const user = await this.findOne(id);
    user.password = await bcrypt.hash(dto.newPassword, 10);
    await this.usersRepo.save(user);
    return { message: 'Password reset successfully' };
  }

  async remove(id: string): Promise<{ message: string }> {
    const user = await this.findOne(id);
    await this.usersRepo.remove(user);
    return { message: 'User deleted successfully' };
  }

  async count(): Promise<number> {
    return this.usersRepo.count();
  }

  async updatePassword(id: string, hashedPassword: string): Promise<void> {
    const user = await this.findOne(id);
    user.password = hashedPassword;
    await this.usersRepo.save(user);
  }
}
