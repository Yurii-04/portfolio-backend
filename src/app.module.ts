import { Module } from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './project/project.module';
import { PrismaModule } from './prisma/prisma.module';
import { NotificationModule } from '~/notification/notification.module';
import { ContactModule } from './contact/contact.module';
import { HashingModule } from './hashing/hashing.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ProjectModule,
    AuthModule,
    PrismaModule,
    NotificationModule,
    ContactModule,
    HashingModule
  ],
})
export class AppModule {}
