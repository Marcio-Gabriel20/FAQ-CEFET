import { ApiExtraModels } from "@nestjs/swagger";
import { Role } from "../enum/role.enum";

@ApiExtraModels()
export class User {
    id?: number;
    email: string;
    password: string;
    name: string;
    role: Role;
}
