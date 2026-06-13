import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, ResetPasswordDto } from './dto/user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<Omit<import("./entities/user.entity").User, "password">[]>;
    findOne(id: string): Promise<import("./entities/user.entity").User>;
    create(dto: CreateUserDto): Promise<Omit<import("./entities/user.entity").User, "password">>;
    update(id: string, dto: UpdateUserDto): Promise<Omit<import("./entities/user.entity").User, "password">>;
    resetPassword(id: string, dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
