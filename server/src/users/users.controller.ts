import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/CreateUser.dto.js';
import { LoginUser } from './dto/LoginUser.dto.js';
import { AuthGuardGuard } from '../auth-guard/auth-guard.guard.js';
import { EmailService } from '../email/email.service.js';
import { VerifyOtpDto } from './dto/VerifyOtp.dto.js';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
  ) { }

  @Get('id/:id')
  getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Post('signup')
  async signup(@Body() body: CreateUserDto) {
    // 1. Create the user (unverified)
    const user = await this.usersService.createUser(body);

    // 2. Generate OTP
    const otp = await this.usersService.generateAndSaveOtp(user.email);

    // 3. Send OTP via email using HTML template
    try {
      await this.emailService.sendMail(
        user.email,
        'Your Verification Code',
        `Your verification code is: ${otp}`, // Fallback text
        this.emailService.getOtpTemplate(otp) // Professional HTML template
      );
    } catch (error) {
      console.error('Failed to send OTP email:', error);
    }

    return {
      message: 'OTP sent to your email. Please verify to complete registration.',
      email: user.email,
    };
  }

  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return await this.usersService.verifyOtp(verifyOtpDto.email, verifyOtpDto.otp);
  }

  @Post('resend-otp')
  async resendOtp(@Body('email') email: string) {
    const otp = await this.usersService.resendOtp(email);
    try {
      await this.emailService.sendMail(
        email,
        'Your New Verification Code',
        `Your new verification code is: ${otp}`, // Fallback text
        this.emailService.getOtpTemplate(otp) // Professional HTML template
      );
    } catch (error) {
      console.error('Failed to send resend-OTP email:', error);
    }
    return { message: 'New OTP sent to your email.' };
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUser) {
    return this.usersService.loginUser(loginUserDto);
  }

  @Get('me')
  @UseGuards(AuthGuardGuard)
  meUser(@Req() req: any) {
    return this.usersService.meUser(req.userId);
  }
}
