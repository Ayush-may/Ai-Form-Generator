import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { FormService } from './form.service';
import { CreateFormDto } from './dto/create-form.dto';
import { AuthGuardGuard } from 'src/auth-guard/auth-guard.guard';

@Controller('form')
export class FormController {
  constructor(private readonly formService: FormService) { }

  @Get("")
  @UseGuards(AuthGuardGuard)
  async getForm(
    @Req() req: any
  ) {
    return this.formService.getForm(req?.userId);
  }

  @Get("slug/:slug")
  @UseGuards(AuthGuardGuard)
  getBySlug(@Param("slug") slug: string) {
    return this.formService.getBySlug(slug);
  }

  @Post()
  @UseGuards(AuthGuardGuard)
  async postForm(
    @Body() body: CreateFormDto,
    @Req() req: any
  ) {
    const userId = req?.userId;
    return this.formService.postForm(userId, body);
  }
  
  @Post("submission")
  async postFormSubmission(
    @Body() body: any
  ) {
    return this.formService.postFormSubmission(body);
  }

  @Get("submissions/:formId")
  @UseGuards(AuthGuardGuard)
  async getFormSubmissions(
    @Param("formId") formId: string,
    @Req() req: any
  ) {
    return this.formService.getFormSubmissions(req?.userId, formId);
  }
}
