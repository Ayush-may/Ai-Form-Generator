import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { FormService } from './form.service';
import { CreateFormDto } from './dto/create-form.dto';
import { AuthGuardGuard } from 'src/auth-guard/auth-guard.guard';

@Controller('form')
export class FormController {
  constructor(private readonly formService: FormService) { }

  @Get(":slug")
  async getFormLive() { }

  @Get("id/:id")
  async getSingleForm() { }

  @Post()
  @UseGuards(AuthGuardGuard)
  async postForm(
    @Body() body: CreateFormDto,
    @Req() req: any
  ) {
    const userId = req?.userId;
    return this.formService.postForm(userId, body);
  }

}
