"use client"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import React, { createContext, useEffect, useState } from "react"
import type { FormType } from "../types/Form"
import http from "../libs/http"

type ChildrenType = {
    children: React.ReactNode
}

type ValueType = {
    // states
    previewForm: FormType | null
    firstMessage: string | null

    // setter
    setPreviewForm: React.Dispatch<React.SetStateAction<FormType | null>>
    setFirstMessage: React.Dispatch<React.SetStateAction<string | null>>

    // helper functions
    fetchConversationByIdHistory: (conversationId: string) => Promise<void>
}

type ChatContextType = ReturnType<typeof useChat> & ValueType

const AiChatContext = createContext<ChatContextType | null>(null)

const AiChatProvider = ({ children }: ChildrenType) => {
    const [previewForm, setPreviewForm] = useState<FormType | null>(null);
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

    // useEffect(() => {
    //     const last = messages[messages.length - 1];
    //     const textPart = last?.parts?.find(p => p.type === "text");

    //     if (textPart?.text) {
    //         console.log("TEXT:", textPart?.text);
    //     } else {
    //         console.log("NOTEXT:", last?.parts);
    //     }
    // }, [messages]);

    const fetchConversationByIdHistory = React.useCallback(async (conversationId: string) => {
        setMessages([]);

        if (chatsCache[conversationId]) {
            setMessages(chatsCache[conversationId]);
            return;
        }

        try {
            const { data }: { data: any } = await http.get(`http://localhost:8000/conversations/${conversationId}/messages`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            // console.log({ data })

            const formattedMessages = data
                .filter((m: any) => m.content || m.formSnapshot)
                .map((m: any) => ({
                    id: m.id,
                    role: m.role.toLowerCase(),
                    content: m.content,
                    formSnapshot:
                        typeof m.formSnapshot === "string"
                            ? JSON.parse(m.formSnapshot)
                            : m.formSnapshot || null,
                }));
                
            console.log({ formattedMessages })

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

    // if (token === null && typeof window !== 'undefined') {
    //     return null;
    // }

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