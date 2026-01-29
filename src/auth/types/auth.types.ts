import { Request } from 'express';
import { JwtPayload } from '~/auth/types/jwt-token.types';

export interface RequestWithUser extends Request {
  user: RtPayload;
}

export interface RtPayload extends JwtPayload {
  refreshToken: string | null;
}

export interface RequestWithCookies extends Request {
  cookies: {
    refreshToken?: string;
    accessToken?: string;
  } & Record<string, string | undefined>;
}