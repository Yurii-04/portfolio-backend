import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { PrismaService } from '~/prisma/prisma.service';

interface TelegramSendMessageResponse {
  ok: boolean;
  description?: string;
}

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private readonly token: string;
  private readonly chatId: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const token = this.configService.getOrThrow<string>('TELEGRAM_BOT_TOKEN');
    const chatId = this.configService.getOrThrow<string>('TELEGRAM_CHAT_ID');

    this.token = token;
    this.chatId = chatId;
  }

  async sendMessage(requestId: string, message: string): Promise<void> {
    const url = `https://api.telegram.org/bot${this.token}/sendMessage`;

    try {
      const response = await lastValueFrom(
        this.httpService.post<TelegramSendMessageResponse>(url, {
          chat_id: this.chatId,
          text: message,
          parse_mode: 'HTML',
        }),
      );

      if (response.data.ok) {
        await this.prisma.contactRequest.update({
          where: { id: requestId },
          data: { telegramSent: true },
        });
      } else {
        const telegramError = response.data.description;
        await this.prisma.contactRequest.update({
          where: { id: requestId },
          data: { telegramError },
        });

        this.logger.error(`Telegram API error: ${telegramError}`);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      await this.prisma.contactRequest.update({
        where: { id: requestId },
        data: { telegramError: message },
      });
      this.logger.error(`Notification failed for request ${requestId}: ${message}`);
    }
  }
}