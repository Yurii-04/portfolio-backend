import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class NotificationModule {}
