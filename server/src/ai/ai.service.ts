import { groq } from '@ai-sdk/groq';
import { BadRequestException, Injectable } from '@nestjs/common';
import { generateText, streamText, type ModelMessage } from 'ai';
import { AiChatDto } from './dto/AiChat.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AiService {
  MODEL_NAME = 'llama-3.3-70b-versatile';

  constructor(private readonly prisma: PrismaService) { }


  async generateConversationTitle(message: string): Promise<string> {
    const result = await generateText({
      model: groq(this.MODEL_NAME),
      system: 'You are a helpful assistant that generates extremely concise, professional titles for chat conversations based on the first message. Use 2-4 words. Do not use quotes or prefixes like "Title:".',
      prompt: `Generate a title for this message: "${message}"`,
    });

    return result.text.trim().replace(/^["']|["']$/g, '');
  }


  // async chatAi(body: AiChatDto): Promise<any> {
  async chatAi(body: any): Promise<any> {
    const { messages: incomingMessages, conversationId, userId } = body;

    if (!incomingMessages?.length || !conversationId || !userId) {
      throw new BadRequestException(
        "Message, ConversationId or UserID is required for chat!"
      );
    }

    const history = await this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });

    const formattedHistory = history.map(msg => ({
      role: msg.role.toLowerCase(),
      content: msg.content,
    }));

    const lastMessage: {
      parts: [
        { type: string, text: string }
      ]
    } = incomingMessages[incomingMessages.length - 1];

    console.log({ lastMessage: JSON.stringify(lastMessage) })

    await this.prisma.message.create({
      data: {
        userId,
        conversationId,
        role: "USER",
        content: lastMessage?.parts?.[0]?.text
      },
    });

    const fullContext = [
      ...formattedHistory,
      { role: 'user', content: lastMessage?.parts?.[0]?.text }
    ];

    const result = streamText({
      model: groq(this.MODEL_NAME),
      // @ts-ignore
      messages: fullContext,
      system: `
      You are "Form Master", a specialized AI expert in UI/UX and form generation. 
      Your goal is to help users create perfect, functional web forms.

      BEHAVIOR RULES:
      1. If the user asks for a form or mentions fields they want to collect, you MUST respond with a structured JSON object.
      2. If the user is just chatting, asking a general question, or seeking advice, respond with a friendly text message.
      3. When generating a form, use this exact structure:
      {
        "message": "A brief, professional confirmation of the form created.",
        "form": [
          { "name": "field_id", "type": "text|number|email|select|checkbox", "label": "Friendly Label", "placeholder": "Example value", "required": true, "options": ["Choice 1", "Choice 2"] }
        ]
      }
      4. Always ensure the "type" matches standard HTML input types.`,
      onFinish: async ({ text }) => {

        console.log({ text })

        await this.prisma.message.create({
          data: {
            userId,
            conversationId,
            role: "ASSISTANT",
            content: text,
          },
        });
      },
    });

    console.log({ result })

    return result;
  }

}
