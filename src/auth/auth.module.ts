import { Module } from '@nestjs/common';
import { GoogleStrategy } from './google.strategy';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';

@Module({
    controllers: [],
    providers: [
        AuthService,
        GoogleStrategy,
        JwtStrategy
    ],
    exports: [AuthService]
})
export class AuthModule {}