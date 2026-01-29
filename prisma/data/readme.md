In this directory create file admin.ts:
```ts
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export const admin: Prisma.AdminCreateInput = {
  email: 'email@gamil.com',
  password: bcrypt.hashSync('password', 10),
}
```