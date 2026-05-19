import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFormDto } from './dto/create-form.dto';

@Injectable()
export class FormService {
    constructor(private readonly prisma: PrismaService) { }

    async getBySlug(slug: string) {
        const f = await this.prisma.form.findUniqueOrThrow({
            where: { slug },
            select: {
                id: true,
                slug: true,
                schema: true,
            }
        }) as { schema: { form: any[] }, id: string, slug: string, };
        return f;
    }

    async getForm(userId: any) {
        const forms = await this.prisma.form.findMany({
            where: { userId },
            select: {
                id: true,
                name: true,
                slug: true,
                status: true,
                visibility: true,
                submissionsCount: true,
            }
        })

        return forms;
    }

    async postForm(userId: any, body: CreateFormDto) {
        return this.prisma.form.create({
            data: {
                userId,
                ...body,
                schema: JSON.parse(body.schema),
            }
        })
    }

    async postFormSubmission(body: any) {
        const form = await this.prisma.form.findUnique({
            where: {
                slug: body.slug
            }
        });

        if (!form) {
            throw new NotFoundException("Form not found");
        }

        await this.prisma.formSubmission.create({
            data: {
                formId: form.id,
                responseData: body.responses
            }
        });

        await this.prisma.form.update({
            where: {
                id: form.id
            },
            data: {
                submissionsCount: {
                    increment: 1
                }
            }
        });

        return {
            message: "Submission saved successfully"
        };
    }
}
