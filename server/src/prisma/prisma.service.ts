import { Injectable } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const adapter = new PrismaMariaDb({
      host: 'localhost',
      port: 3306,
      password: 'root',
      user: 'root',
      database: 'myapp',

      allowPublicKeyRetrieval: true,
      ssl: false,
    });
    super({ adapter });
  }
}
