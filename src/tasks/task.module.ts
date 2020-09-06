import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { ItemService } from '../item/item.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from '../item/item.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Item])],
    providers: [TaskService, ItemService],
})
export class TasksModule {}