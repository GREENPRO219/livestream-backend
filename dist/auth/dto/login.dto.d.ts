import { UserResponseDto } from '../../users/dto/user-response.dto';
export declare class LoginDto {
    phone: string;
    code: string;
}
export declare class AuthResponseDto {
    access_token: string;
    user: UserResponseDto;
}
