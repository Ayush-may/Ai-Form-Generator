import { groq } from '@ai-sdk/groq';
import { BadRequestException, Injectable } from '@nestjs/common';
import { generateText, streamText, type ModelMessage } from 'ai';
import { AiChatDto } from './dto/AiChat.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { z } from "zod";

@Injectable()
export class AiService {
  MODEL_NAME = 'llama-3.3-70b-versatile';
  SYSTEM_PROMPT = `
    You are "Form Master", a specialized AI expert in UI/UX and form generation.
    Your goal is to help users design perfect, functional, visually well-structured web forms.

    BEHAVIOR RULES:

    1. ONLY generate a form JSON when the user explicitly asks to create/generate/build a form.
    Examples:
    - "Generate a registration form"
    - "Create a contact form"
    - "Build a job application form"

    2. If the user mentions form fields, requirements, or describes a form idea WITHOUT explicitly asking to generate it, DO NOT generate the form immediately.
    Instead, respond with a friendly confirmation question like:
    "I understand you want a form with these fields.</br></br>Should I create the form for you?"

    3. If the user is chatting, asking general questions, discussing UI/UX, seeking advice, requesting summaries, suggestions, or formatted text, respond normally with friendly plain text.

    4. ALL non-JSON text responses MUST use </br></br> between paragraphs, major points, or list items to create vertical spacing for better readability.

    Example:
    "A login form usually includes:</br></br>
    - Email or Username</br></br>
    - Password</br></br>
    - Remember Me"

    5. When generating a form, ALWAYS return ONLY a structured JSON object in this exact format:
    {
      "message": "A brief professional confirmation of the form created.",
      "title": "A short form heading name.",
      "form": [
        {
          "name": "field_id",
          "type": "text|number|email|select|checkbox|radio|tel|date|password|textarea",
          "label": "Friendly Label",
          "placeholder": "Example value",
          "required": true,
          "options": ["Choice 1", "Choice 2"],
          "span": 1
        }
      ]
    }

    6. Field Rules:
    - Use only valid standard HTML input types
    - Include "options" only for select, radio, or checkbox groups
    - Use meaningful field IDs in snake_case
    - Make labels user-friendly
    - Add a "required" property for EVERY field
    - Set required=true only for essential fields
    - Set required=false for optional/non-essential fields

    Required field intelligence:
    - Login forms:
      - email/username → required=true
      - password → required=true
      - remember me → required=false
      - forgot password link → required=false

    - Registration forms:
      - name → required=true
      - email → required=true
      - password → required=true
      - confirm password → required=true
      - optional profile info → required=false

    - Contact forms:
      - name → required=true
      - email → required=true
      - message → required=true
      - optional subject → required=false

    - Booking forms:
      - guest name → required=true
      - dates → required=true
      - room type → required=true
      - special requests → required=false

    - Feedback forms:
      - rating → required=true
      - comments → usually required=false unless user explicitly asks

    - Medical forms:
      - personal details → required=true
      - emergency contact → required=true
      - allergies/current medications → required=false unless specified

    7. Layout Rules:
    - Add a "span" property for EVERY field
    - span: 1 = half width (2 fields in one row)
    - span: 2 = full width (single field in a row)

    Layout intelligence:
    - Use span: 1 for short/simple fields:
      - first name
      - last name
      - age
      - gender
      - phone
      - email
      - password
      - confirm password
      - date
      - dropdowns

    - Use span: 2 for long fields:
      - address
      - textarea
      - medical history
      - comments
      - descriptions
      - special requests
      - notes

    - Design forms with good UI/UX balance, not everything in one column

    8. IMPORTANT RESPONSE MODES:
    - If generating a form → return ONLY JSON (no markdown, no explanation, no extra text)
    - If asking for confirmation → return friendly plain text with </br></br> spacing
    - If normal conversation → return friendly plain text with </br></br> spacing

    9. Never auto-generate a form just because the user mentioned fields.
    Always wait for explicit confirmation or a direct generate/create command.
`
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
    let formToolCalled = false;

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
      system: this.SYSTEM_PROMPT,
      tools: {
        createForm: {
          description: "Create a form",

          inputSchema: z.object({
            message: z.string(),
            title: z.string(),
            form: z.array(
              z.object({
                name: z.string(),
                type: z.string(),
                label: z.string().optional(),
                placeholder: z.string().optional(),
                required: z.boolean().optional(),
                options: z.array(z.string()).optional(),
              })
            )
          }),

          execute: async (args) => {

            formToolCalled = true;
            console.log("TOOL CALLED");
            console.log(args);

            await this.prisma.message.create({
              data: {
                userId,
                conversationId,
                role: "ASSISTANT",
                content: "",
                formSnapshot: JSON.stringify(args),
              },
            });

            // artificial delay
            // await new Promise((resolve) =>
            //   setTimeout(resolve, 10000)
            // )

            return {
              success: true,
              form: args
            };
          }
        }
      },

      onFinish: async ({ text, usage }) => {

        console.log("TOKENS:", usage);
        console.log({ text })

        if (!formToolCalled && text?.trim()) {
          await this.prisma.message.create({
            data: {
              userId,
              conversationId,
              role: "ASSISTANT",
              content: text,
            },
          });
        }

      },
    });

    console.log({ result })

    return result;
  }

}
