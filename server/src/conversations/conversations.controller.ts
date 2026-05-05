import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { AuthGuardGuard } from 'src/auth-guard/auth-guard.guard';

@Controller('conversations')
@UseGuards(AuthGuardGuard)
export class ConversationsController {
    constructor(private readonly conversationsService: ConversationsService) { }

    @Get('user')
    getConversationByUserId(@Req() req: any) {
        return this.conversationsService.getConversationByUserId(req.userId);
    }

    @Get(":conversationId/messages")
    getConversationMessageById(
        @Param("conversationId") conversationId: string,
    ) {
        return this.conversationsService.getConversationMessageById(conversationId);
    }

    @Post()
    createConversation(
        @Body() body: { message: string },
        @Req() req: any) {
        const userId = req.userId;
        const { message } = body;
        return this.conversationsService.createConversation(userId, message);
    }
}
