import { Group, Panel, Separator } from "react-resizable-panels";
import { useParams } from "react-router-dom"
import MessageList from "./MessageList";
import { useAiChat } from "../providers/AiChatProvider";
import { useEffect, useRef, useState, useDeferredValue } from "react";
import { VscLoading } from "react-icons/vsc";
import { BiSend } from "react-icons/bi";
import PreviewForm from "./PreviewForm";
import { useAuth } from "../providers/AuthProvider";

const ConversationComponent = () => {
    const params = useParams();
    const id = params.id;
    const { token } = useAuth();

    const {
        // state
        messages,
        status,
        previewForm,
        firstMessage,

        // setter
        setPreviewForm,
        fetchConversationByIdHistory,
        setFirstMessage,

        // helper
        sendMessage,
        setMessages,

    } = useAiChat();

    const [inputText, setInputText] = useState("");
    const deferredMessages = useDeferredValue(messages);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const chatComponentRef = useRef<HTMLDivElement>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const isFirstMessageSent = useRef(false);

    // Reset the ref when the conversation ID changes
    useEffect(() => {
        isFirstMessageSent.current = false;
    }, [id]);

    // sends first message after route load
    useEffect(() => {
        if (firstMessage && id && !isFirstMessageSent.current) {
            if (firstMessage.trim()) {
                try {
                    isFirstMessageSent.current = true;
                    sendMessage(
                        { text: firstMessage },
                        {
                            body: {
                                conversationId: id,
                                message: firstMessage,
                            },
                            headers: {
                                "Authorization": "Bearer " + token
                            }
                        }
                    )
                    setFirstMessage(null)
                } catch (error) {
                    console.error("Error sending message:", error)
                    isFirstMessageSent.current = false;
                }
            }
        }
    }, [firstMessage, id])


    // fetches previous history
    useEffect(() => {
        // Only fetch history if we're not in the middle of sending the first message
        // and we haven't already sent a first message in this session
        if (id && !firstMessage && !isFirstMessageSent.current) {
            fetchConversationByIdHistory(id);
        }
    }, [id, firstMessage]);

    // Focus textarea when stream ends
    useEffect(() => {
        if (status !== 'streaming') {
            textAreaRef.current?.focus();
        }
    }, [status]);

    // Auto scroll to bottom
    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
    }, [messages, status]);

    const checkAndSend = async () => {
        if (inputText.trim()) {
            try {
                sendMessage(
                    { text: inputText.trim() },
                    {
                        body: {
                            conversationId: id,
                            message: inputText.trim(),
                        },
                        headers: {
                            "Authorization": "Bearer " + token
                        }
                    }
                )
                setInputText("")
            } catch (error) {
                console.error("Error sending message:", error)
            }
            textAreaRef.current?.focus();
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            checkAndSend();
        }
    }

    return (
        <Group className='__chat-multi-panel' orientation='horizontal' >

            <Panel className='__chat-compo'  >
                <div className='__chat-area' ref={scrollAreaRef} >
                    <MessageList messages={deferredMessages} status={status} />
                </div>

                <div className='__chat-compo-area move-down' ref={chatComponentRef} >
                    <div className='__chat-compo-textarea-container' >
                        <textarea
                            id='textarea-id'
                            ref={textAreaRef}
                            onKeyDown={handleKeyDown}
                            onChange={(e) => {
                                setInputText(e.target.value)
                            }}
                            value={inputText}
                            disabled={status === 'streaming'}
                            className='__chat-compo-textarea'
                            placeholder={messages.length > 0 ?
                                `Reply` :
                                `Ask Formiq to generate a form \nExample: Create a customer feedback form with name, email, rating and comments.`}
                        />
                        <span>
                            {status === "streaming" ?
                                <span className='__chat-compo-icon streaming' >
                                    <VscLoading size={20} className='icon' />
                                </span> :
                                <BiSend size={20} className='__chat-compo-icon' onClick={checkAndSend} />}
                        </span>
                    </div>
                </div>
            </Panel>



            {
                previewForm &&
                <>
                    <Separator />
                    <Panel maxSize={"60%"} className='__preview-panel'>
                        <PreviewForm />
                    </Panel>
                </>
            }

        </Group>
    )
}

export default ConversationComponent