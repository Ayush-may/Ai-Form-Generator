import { type ModelMessage } from 'ai';

export class AiChatDto {
  messages!: Array<ModelMessage>;

  userId!: string;

  conversationId!: string;

  // Option 1: Explicitly define the custom fields you expect (recommended)
  customField?: string;
  anotherField?: number;

  // Option 2: Add an index signature to allow ANY extra properties
  [key: string]: any;
}
