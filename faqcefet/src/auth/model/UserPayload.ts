import { Role } from "src/user/enum/role.enum";

export interface UserPayload {
    sub: number;
    email: string;
    name: string;
    role: Role;
    iat?: number;
    exp?: number;
}