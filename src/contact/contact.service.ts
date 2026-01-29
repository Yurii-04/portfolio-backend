import { Injectable } from '@nestjs/common';
import { CreateContactDto } from '~/contact/dto/contact.dto';
import { TelegramService } from '~/notification/telegram.service';
import { PrismaService } from '~/prisma/prisma.service';
import { StatusResponse } from '~/common/interfaces';

@Injectable()
export class ContactService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly telegramService: TelegramService
  ) {}

  async create(dto: CreateContactDto): Promise<StatusResponse> {
    const request = await this.prisma.contactRequest.create({
      data: {
        name: dto.name,
        email: dto.email,
        message: dto.message,
      }
    })

    const message = `
      <b>New appeal!</b>
      <b>Name:</b> ${dto.name}
      <b>Email:</b> ${dto.email}
      <b>Message:</b> ${dto.message || '-'}
        `.trim();

    await this.telegramService.sendMessage(request.id, message);
    return {success: true}
  }
}
