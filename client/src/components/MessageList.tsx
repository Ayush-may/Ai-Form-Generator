"use client"

import { memo } from "react"
import type { ChatStatus, UIMessage } from "ai"
import MessageMarkdown from "./MessageMarkdown"
import { useAiChat } from "../providers/AiChatProvider"

type Props = {
    messages: UIMessage[],
    status: ChatStatus
}

const MessageList = memo(({ messages, status }: Props) => {
    const { setPreviewForm } = useAiChat();

    return (
        <>
            {messages.map((m) => (
                <MessageMarkdown
                    key={m.id}
                    message={m}
                    status={status}
                    setPreviewForm={setPreviewForm}
                />
            ))}
        </>
    )
})

export default MessageList