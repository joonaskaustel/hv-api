import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { Item } from '../item/item.entity';

@Injectable()
export class UserService {
    private alias = 'u';
    constructor(
      @InjectRepository(User)
      private usersRepository: Repository<User>,
    ) {}

    async createQueryBuilder(): Promise<SelectQueryBuilder<User>> {
        return await getRepository(User).createQueryBuilder(`${this.alias}`);
    }

    findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    findOne(id: string): Promise<User> {
        return this.usersRepository.findOne(id);
    }

    findOneByGoogleId(googleId: string): Promise<User> {
        return this.usersRepository.findOne({ googleId }, { relations: ['items'] });
    }

    async remove(id: string): Promise<void> {
        await this.usersRepository.delete(id);
    }

    async save(user: User): Promise<User> {
        console.log('user ', user)
        return await this.usersRepository.save(user);
    }

    async findUserItemsByGoogleId(googleId: string) {
        const user = await this.findOneByGoogleId(googleId);

        console.log('user: ', user)

        return user.items;

    }

}