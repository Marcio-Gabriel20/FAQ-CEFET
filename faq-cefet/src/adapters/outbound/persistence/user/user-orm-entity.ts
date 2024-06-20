import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class UserOrmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    username: string;

    @Column()
    password: string;
}