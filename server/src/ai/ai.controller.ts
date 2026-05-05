import { Body, Controller, InternalServerErrorException, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { AuthGuardGuard } from 'src/auth-guard/auth-guard.guard';
import { AiChatDto } from './dto/AiChat.dto';
import { ModelMessage, streamText } from 'ai';
import { groq } from '@ai-sdk/groq';
import { type Response } from 'express';

@Controller('ai')
export class AiController {
    MODEL_NAME = 'llama-3.3-70b-versatile';

    constructor(private readonly aiService: AiService) { }

    @Post('chat')
    @UseGuards(AuthGuardGuard)
    async chat(
        // @Body() body: AiChatDto,
        @Body() body: any,
        @Req() req: any,
        @Res() res: Response
    ) {
        try {
            const userId = req.userId;

            console.log({ ...body, userId })

            const result = await this.aiService.chatAi({
                ...body,
                userId,
            });

            result.pipeUIMessageStreamToResponse(res);
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException(error);
        }
    }

    @Post('test')
    aiTest(@Body() body: { message: string }) {
        return this.aiService.generateConversationTitle(body.message);
    }
}
