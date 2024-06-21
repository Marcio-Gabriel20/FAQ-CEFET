import { Role } from "src/user/enums/role.enum";

export interface UserFromJwt {
    id: number;
    email: string;
    name: string;
    role: Role;
}