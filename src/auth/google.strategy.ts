import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { AuthService, Provider } from './auth.service';


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {

    constructor(
      private readonly authService: AuthService,
    ) {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID, // <- Replace this with your client id
            clientSecret: process.env.GOOGLE_SECRET, // <- Replace this with your client secret
            callbackURL: process.env.GOOGLE_AUTH_CALLBACK_URL,
            passReqToCallback: true,
            scope: ['profile', 'email'],
        });
    }


    async validate(request: any, accessToken: string, refreshToken: string, profile, done: Function) {
        try {
            console.log(profile);
            const { name, emails } = profile
            const jwt: string = await this.authService.validateOAuthLogin(emails[0].value, name.givenName, name.familyName, profile.id, Provider.GOOGLE);
            const user = {
                email: emails[0].value,
                firstName: name.givenName,
                lastName: name.familyName,
                jwt,
            };

            done(null, user);
        } catch (err) {
            // console.log(err)
            done(err, false);
        }
    }

}