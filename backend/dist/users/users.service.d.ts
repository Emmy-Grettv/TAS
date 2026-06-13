import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto, ResetPasswordDto } from './dto/user.dto';
export declare class UsersService {
    private usersRepo;
    constructor(usersRepo: Repository<User>);
    findAll(): Promise<Omit<User, 'password'>[]>;
    findOne(id: string): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    create(dto: CreateUserDto): Promise<Omit<User, 'password'>>;
    update(id: string, dto: UpdateUserDto): Promise<Omit<User, 'password'>>;
    resetPassword(id: string, dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    count(): Promise<number>;
}
