import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateContactDto {
  @IsString()
  name: string

  @IsEmail()
  email: string

  @IsString()
  @IsOptional()
  message?: string
}