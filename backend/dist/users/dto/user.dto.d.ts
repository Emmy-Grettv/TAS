import { UserRole } from '../entities/user.entity';
export declare class CreateUserDto {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
}
export declare class UpdateUserDto {
    name?: string;
    email?: string;
    role?: UserRole;
    isActive?: boolean;
}
export declare class ResetPasswordDto {
    newPassword: string;
}
