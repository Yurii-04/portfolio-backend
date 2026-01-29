import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { GetUserId } from '~/common/decorators';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';
import { Tokens } from './types/jwt-token.types';
import { AtGuard, RtGuard } from '~/common/guards';
import { RequestWithUser } from '~/auth/types/auth.types';
import { StatusResponse } from '~/common/interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(@Body() dto: LoginDto): Promise<Tokens> {
    return this.authService.login(dto);
  }

  @UseGuards(AtGuard)
  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  async logout(@GetUserId() userId: string): Promise<StatusResponse> {
    return this.authService.logout(userId);
  }

  @UseGuards(RtGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/refresh')
  async refresh(
    @GetUserId() userId: string,
    @Req() req: RequestWithUser
  ): Promise<Tokens> {
    const refreshToken = req.user.refreshToken;
    return this.authService.refreshTokens(
      userId,
      refreshToken!,
    );
  }
}
