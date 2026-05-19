import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AuthGuardGuard implements CanActivate {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader: string = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No Token');
    }

    const token = authHeader.split(' ')[1];

    let decoded: { id?: string };
    try {
      const key = this.config.get<string>('JWT_KEY');
      decoded = jwt.verify(token, key!) as { id?: string };

    } catch (err) {
      // @ts-ignore
      console.error('JWT Verification Error:', err?.message);
      throw new UnauthorizedException('Invalid token');
    }

    if (!decoded || !decoded.id) {
      throw new UnauthorizedException('Token is malformed');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        isVerified: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found (Database was likely reset)');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('Please verify your email address');
    }

    req.userId = decoded.id;
    req.user = user;

    return true;
  }
}
