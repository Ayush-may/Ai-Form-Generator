import { Controller } from '@nestjs/common';
import { EmailService } from './email.service.js';

@Controller()
export class EmailController {
  constructor(private readonly emailService: EmailService) {}
}
