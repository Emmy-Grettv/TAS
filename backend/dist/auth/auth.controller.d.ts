import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        token: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: import("../users/entities/user.entity").UserRole;
        };
    }>;
    getProfile(req: any): Promise<{
        id: string;
        name: string;
        email: string;
        role: import("../users/entities/user.entity").UserRole;
    }>;
}
