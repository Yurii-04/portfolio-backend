import { ForbiddenException, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/auth.dto';
import { PrismaService } from '~/prisma/prisma.service';
import { HashingService } from '~/hashing/hashing.service';
import { JwtTokenService } from '~/auth/jwt-token.service';
import { Tokens } from '~/auth/types/jwt-token.types';
import { StatusResponse } from '~/common/interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashingService: HashingService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async login(dto: LoginDto): Promise<Tokens> {
    const user = await this.prisma.admin.findUnique({
      where: { email: dto.email },
    });

    if (!user || !user.password) {
      throw new ForbiddenException('Wrong email or password');
    }

    const passwordMatches = await this.hashingService.compare(
      dto.password,
      user.password,
    );

    if (!passwordMatches) throw new ForbiddenException('Wrong email or password');

    const tokens = await this.jwtTokenService.signTokens({
      email: user.email,
      sub: user.id,
    });

    await this.updateRt(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: string): Promise<StatusResponse> {
    await this.prisma.admin.update({
      where: { id: userId },
      data: { refreshToken: null },
    });

    return { success: true };
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<Tokens> {
    const user = await this.prisma.admin.findUnique({
      where: { id: userId },
    });

    if (!user?.refreshToken) throw new ForbiddenException();

    const rtMatches = await this.hashingService.compare(refreshToken, user.refreshToken);
    if (!rtMatches) throw new ForbiddenException();

    const tokens = await this.jwtTokenService.signTokens({
      email: user.email,
      sub: user.id,
    });

    await this.updateRt(user.id, tokens.refreshToken);
    return tokens;
  }

  private async updateRt(userId: string, rt: string): Promise<void> {
    const hashedRt = await this.hashingService.hash(rt, 10);
    await this.prisma.admin.update({
      where: { id: userId },
      data: { refreshToken: hashedRt },
    });
  }
}
