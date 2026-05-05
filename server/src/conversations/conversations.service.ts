import { BadRequestException, Injectable } from '@nestjs/common';
import { AiService } from 'src/ai/ai.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ConversationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AiService,
  ) { }

  getConversationByUserId(id: string) {
    return this.prisma.conversation.findMany({
      where: { userId: id },
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  async getConversationMessageById(conversationId: string) {
    const result = await this.prisma.message.findMany({
      where: {
        conversationId
      },
      orderBy: {
        createdAt: "asc"
      }
    });

    return result;
  }

  async createConversation(userId: string, message: string) {
    if (!message || !userId)
      throw new BadRequestException(
        'UserId or Message is required to create conversation!',
      );

    const title = await this.aiService.generateConversationTitle(message);

    const newConversation = await this.prisma.conversation.create({
      data: {
        userId,
        content: title,
      },
    });

    return {
      conversation: {
        id: newConversation.id,
        content: newConversation.content,
      },
    };
  }
}
