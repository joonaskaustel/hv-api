import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './item.entity';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { GoogleStrategy } from '../auth/google.strategy';
import { JwtStrategy } from '../auth/jwt.strategy';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { EmailService } from '../email/email.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Item]),
        TypeOrmModule.forFeature([User]),
    ],
    providers: [
        ItemService,
        GoogleStrategy,
        JwtStrategy,
        AuthService,
        UserService,
        EmailService,
    ],
    controllers: [ItemController],
})
export class ItemModule {
}