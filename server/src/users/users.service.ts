import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto } from './dto/CreateUser.dto.js';
import { LoginUser } from './dto/LoginUser.dto.js';
import jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) { }

  getUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        isVerified: true,
      },
    });
  }

  async createUser(createUserDto: CreateUserDto) {
    const { password, email } = createUserDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      if (existingUser.isVerified) {
        throw new BadRequestException('User already exists and is verified.');
      }
      // If user exists but not verified, we can just update their password or leave as is
      // For now, let's just update the password in case they changed it
      const hash = await bcrypt.hash(password, 10);
      return this.prisma.user.update({
        where: { email },
        data: {
          ...createUserDto,
          password: hash,
        },
      });
    }

    const hash = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hash,
        isVerified: false,
      },
    });
  }

  async generateAndSaveOtp(email: string) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    await this.prisma.otp.upsert({
      where: { email },
      update: {
        otp,
        expiresAt,
      },
      create: {
        email,
        otp,
        expiresAt,
      },
    });

    return otp;
  }

  async verifyOtp(email: string, otp: string) {
    const otpRecord = await this.prisma.otp.findUnique({
      where: { email },
    });

    if (!otpRecord) {
      throw new BadRequestException('OTP not found for this email.');
    }

    if (otpRecord.otp !== otp) {
      throw new BadRequestException('Invalid OTP.');
    }

    if (new Date() > otpRecord.expiresAt) {
      throw new BadRequestException('OTP has expired.');
    }

    // Mark user as verified
    await this.prisma.user.update({
      where: { email },
      data: { isVerified: true },
    });

    // Delete the OTP record
    await this.prisma.otp.delete({
      where: { email },
    });

    return { message: 'Email verified successfully.' };
  }

  async resendOtp(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    if (user.isVerified) {
      throw new BadRequestException('User is already verified.');
    }

    const otp = await this.generateAndSaveOtp(email);
    return otp; // The controller will send this via email
  }

  async loginUser(loginUserDto: LoginUser) {
    const { email, password } = loginUserDto;

    if (!email) {
      throw new BadRequestException('Email is required!');
    }

    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found using this email!');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('Please verify your email before logging in.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('User password is not match!');
    }

    const key = this.config.get<string>('JWT_KEY');
    const token = jwt.sign(
      {
        id: user.id,
      },
      key!,
    );

    return {
      token,
    };
  }

  async meUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    })

    return user;
  }
}
