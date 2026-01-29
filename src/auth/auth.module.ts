import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtTokenService } from '~/auth/jwt-token.service';
import { JwtModule } from '@nestjs/jwt';
import { HashingModule } from '~/hashing/hashing.module';
import { AtStrategy } from '~/auth/strategies/at.strategy';
import { RtStrategy } from '~/auth/strategies/rt.strategy';

@Module({
  imports: [HashingModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtTokenService,
    AtStrategy,
    RtStrategy,
  ],
})

export class AuthModule {
}
