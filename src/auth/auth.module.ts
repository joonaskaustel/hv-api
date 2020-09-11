import { Module } from '@nestjs/common';

import { GoogleStrategy } from './google.strategy';
import { JwtStrategy } from './jwt.strategy';

@Module({
    controllers: [],
    providers: [
        GoogleStrategy,
        JwtStrategy
    ]
})
export class AuthModule {}