import { Body, Controller, Post } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from '~/contact/dto/contact.dto';
import { StatusResponse } from '~/common/interfaces';

@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {
  }

  @Post()
  async create(@Body() dto: CreateContactDto): Promise<StatusResponse> {
    return this.contactService.create(dto)
  }
}
