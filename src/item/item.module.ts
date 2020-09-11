import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './item.entity';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { GoogleStrategy } from '../auth/google.strategy';
import { JwtStrategy } from '../auth/jwt.strategy';

@Module({
    imports: [TypeOrmModule.forFeature([Item])],
    providers: [ItemService,
        GoogleStrategy,
        JwtStrategy],
    controllers: [ItemController],
})
export class ItemModule {}