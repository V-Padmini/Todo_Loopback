import {Provider, inject} from '@loopback/core';
import {UserProfile} from '@loopback/security';
import {Request, RestBindings} from '@loopback/rest';
import {JWTStrategy} from '../strategies/jwt.strategy';

export class CurrentUserProvider implements Provider<UserProfile> {
  constructor(
    @inject(RestBindings.Http.REQUEST) private request: Request,
  ) {}

  async value(): Promise<UserProfile> {
    const strategy = new JWTStrategy();
    return strategy.authenticate(this.request);
  }
}