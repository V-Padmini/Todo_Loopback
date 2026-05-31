// src/strategies/jwt.strategy.ts
import {AuthenticationStrategy} from '@loopback/authentication';
import {Request} from '@loopback/rest';
import {UserProfile, securityId} from '@loopback/security';
import {HttpErrors} from '@loopback/rest';
import jwt from 'jsonwebtoken';
import {JWT_SECRET} from '../keys';

export class JWTStrategy implements AuthenticationStrategy {
  name = 'jwt';

  async authenticate(request: Request): Promise<UserProfile> {
    const authHeader = request.headers.authorization;

    if (!authHeader) throw new HttpErrors.Unauthorized('Authorization header missing');

    const header = Array.isArray(authHeader) ? authHeader[0] : authHeader;

    const parts = header.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new HttpErrors.Unauthorized('Invalid Authorization header format. Use: Bearer <token>');
    }

    const token = parts[1];
    let payload: any;

    try {
      payload = jwt.verify(token, JWT_SECRET) as {id: number; username: string; role: string};
    } catch (err) {
      throw new HttpErrors.Unauthorized('Invalid or expired token');
    }

    const user: UserProfile = {
      [securityId]: payload.id.toString(),
      name: payload.username,
      role: payload.role,
    };

    return user;
  }
}