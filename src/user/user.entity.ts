import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Item } from '../item/item.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ nullable: false, unique: true })
    email: string;

    @Column({ nullable: false, unique: true })
    googleId: string;

    @Column({ default: true })
    isActive: boolean;

    @ManyToMany(() => Item, item => item.users)
    items: Item[];
}