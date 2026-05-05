import { Module } from '@nestjs/common';
import { EmailService } from './email.service.js';
import { EmailController } from './email.controller.js';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule { }
