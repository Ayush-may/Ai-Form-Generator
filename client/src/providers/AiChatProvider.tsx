"use client"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import React, { createContext, useEffect, useState } from "react"

type ChildrenType = {
    children: React.ReactNode
}

type ValueType = {
    // states
    previewForm: string | null
    firstMessage: string | null

    // setter
    setPreviewForm: React.Dispatch<React.SetStateAction<string | null>>
    setFirstMessage: React.Dispatch<React.SetStateAction<string | null>>

    // helper functions
    fetchConversationByIdHistory: (conversationId: string) => Promise<void>
}

type ChatContextType = ReturnType<typeof useChat> & ValueType

const AiChatContext = createContext<ChatContextType | null>(null)

const AiChatProvider = ({ children }: ChildrenType) => {
    const [previewForm, setPreviewForm] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [chatsCache, setChatsCache] = useState<{ [key: string]: any[] }>({});
    const [firstMessage, setFirstMessage] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        setToken(storedToken);
    }, []);

    const {
        messages,
        sendMessage,
        status,
        setMessages,
        ...chatRest
    } = useChat({
        transport: new DefaultChatTransport({
            api: "http://localhost:8000/ai/chat",
            headers: {
                authorization: `Bearer ${token}`
            }
        })
    })
    useEffect(() => {
        const last = messages[messages.length - 1];
        const textPart = last?.parts?.find(p => p.type === "text");

        console.log("TEXT:", textPart?.text);
    }, [messages]);

    const fetchConversationByIdHistory = React.useCallback(async (conversationId: string) => {
        // Clear immediately to prevent UI flicker/leak
        setMessages([]);

        if (chatsCache[conversationId]) {
            setMessages(chatsCache[conversationId]);
            return;
        }

        try {
            const res = await fetch(`http://localhost:8000/conversations/${conversationId}/messages`, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });
            const data = await res.json();

            const formattedMessages = data.map((m: any) => ({
                id: m.id,
                role: m.role.toLowerCase(),
                content: m.content
            }));

            setChatsCache(prev => ({ ...prev, [conversationId]: formattedMessages }));
            setMessages(formattedMessages);
        } catch (error) {
            console.error("Error fetching history:", error);
        }
    }, [token, chatsCache, setMessages]);


    const chatValue = React.useMemo(() => ({
        messages,
        sendMessage,
        status,
        setMessages,
        previewForm,
        firstMessage,
        setFirstMessage,
        setPreviewForm,
        fetchConversationByIdHistory,
        ...chatRest
    }), [
        messages,
        sendMessage,
        status,
        setMessages,
        previewForm,
        firstMessage,
        setFirstMessage,
        setPreviewForm,
        fetchConversationByIdHistory,
        // We omit chatRest from dependencies because it's a new object every render 
        // due to destructuring, and the functions within it are stable.
    ]);

    if (token === null && typeof window !== 'undefined') {
        return null;
    }

    return (
        <AiChatContext.Provider value={chatValue}>
            {children}
        </AiChatContext.Provider>
    )
}

export const useAiChat = () => {
    const context = React.useContext(AiChatContext)

    if (!context) {
        throw new Error("useAiChat must be used inside AiChatProvider")
    }

    return context
}

export default AiChatProvider