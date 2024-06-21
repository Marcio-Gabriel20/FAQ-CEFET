import { Role } from "src/user/enum/role.enum";

export interface UserFromJwt {
    id: number;
    email: string;
    name: string;
    role: Role;
}