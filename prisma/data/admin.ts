import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as process from 'node:process';

export const admin: Prisma.AdminCreateInput = {
  email: process.env.ADMIN_EMAIL!,
  password: bcrypt.hashSync(process.env.ADMIN_PASSWORD!, 10),
}