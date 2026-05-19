import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFormDto } from './dto/create-form.dto';

@Injectable()
export class FormService {
    constructor(private readonly prisma: PrismaService) { }

    async postForm(userId: any, body: CreateFormDto) {
        return this.prisma.form.create({
            data: {
                userId,
                ...body,
                schema: JSON.parse(body.schema),
            }
        })
    }

}
