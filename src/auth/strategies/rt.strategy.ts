import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { RequestWithCookies, RtPayload } from '~/auth/types/auth.types';
import { JwtPayload } from '~/auth/types/jwt-token.types';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(config: ConfigService) {
    const rtSecret = config.getOrThrow<string>('RT_SECRET');

    super({
      jwtFromRequest: RtStrategy.extractJwt,
      secretOrKey: rtSecret,
      passReqToCallback: true,
    });
  }

  private static extractJwt(
    this: void,
    req: RequestWithCookies,
  ): string | null {
    const cookieToken = req.cookies?.refreshToken;
    if (cookieToken) {
      return cookieToken;
    }

    const headerToken = req.headers['x-refresh-token'];
    if (headerToken) {
      return Array.isArray(headerToken) ? headerToken[0] : headerToken;
    }

    throw new ForbiddenException('Refresh token not found');
  }

  validate(req: RequestWithCookies, payload: JwtPayload): RtPayload {
    const refreshToken = RtStrategy.extractJwt(req);
    console.log(refreshToken);

    return {
      sub: payload.sub,
      email: payload.email,
      refreshToken,
    };
  }
}