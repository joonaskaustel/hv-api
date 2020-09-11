import { Module } from '@nestjs/common';
import { GoogleService } from './google.service';
import { GoogleController } from './google.controller';
import { GoogleStrategy } from '../auth/google.strategy';
import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { UsersModule } from '../user/user.module';
import { UserRepository } from '../user/user.repository';
import { JwtStrategy } from '../auth/jwt.strategy';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [GoogleService,
        GoogleStrategy,
        JwtStrategy],
    controllers: [GoogleController],
})
export class GoogleModule {}