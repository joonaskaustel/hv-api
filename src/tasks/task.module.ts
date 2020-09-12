import { HttpModule, Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { ItemService } from '../item/item.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from '../item/item.entity';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Item]),
        TypeOrmModule.forFeature([User]),
        HttpModule,
    ],
    providers: [TaskService, ItemService, UserService],
})
export class TasksModule {}