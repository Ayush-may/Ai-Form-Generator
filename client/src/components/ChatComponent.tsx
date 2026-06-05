import React, { memo, useEffect, useRef, useState } from 'react'
import "../styles/ChatComponent.css"
import { BiSend } from 'react-icons/bi'
import MessageList from './MessageList'
import { VscLoading } from 'react-icons/vsc'
import { useAiChat } from '../providers/AiChatProvider'
import { Group, Panel, Separator } from "react-resizable-panels"
import PreviewForm from './PreviewForm'
import http from '../libs/http'
import { useNavigate, useLocation } from 'react-router-dom'

const message = `Sure! I've created a basic Gym Membership Form for you.

Fields included:
• Full Name
• Email Address
• Phone Number
• Age
• Membership Plan (Monthly / Quarterly / Yearly)
• Preferred Workout Time
• Emergency Contact Number

You can preview the form on the right panel.`

const markdownMessage = `### ✅ Gym Membership Form Created

I've generated a **Gym Membership Form** for you.  
You can see the **live preview on the right panel**.

#### 📝 Fields Included

- Full Name
- Email Address
- Phone Number
- Age
- Membership Plan
  - Monthly
  - Quarterly
  - Yearly
- Preferred Workout Time
- Emergency Contact Number

#### ⚙️ Validation Rules

- **Email** must be a valid email address  
- **Phone Number** must contain 10 digits  
- **Age** must be between \`16\` and \`65\`

#### 📌 What would you like to change?

You can ask me to:

- ➕ Add more fields  
- 🔄 Change field types (e.g., text → dropdown)  
- 🧾 Add sections like *Medical Information*  
- 🎨 Customize form layout or styling  

Just tell me what you'd like to update and I'll modify the form instantly.`;

type AIMessage = {
    role: "assistant" | "user"
    content: string
    form?: FormSchema
}

type FormSchema = {
    title: string
    fields: {
        type: string
        label: string
        required?: boolean
    }[]
}

const ChatComponent = () => {

    const [inputText, setInputText] = useState("")
    const navigate = useNavigate();
    const location = useLocation();
    const textAreaRef = useRef<HTMLTextAreaElement>(null)
    const chatComponentRef = useRef<HTMLDivElement>(null)

    const {
        // state
        messages,
        status,
        previewForm,

        // setter 
        setFirstMessage,
        sendMessage,
        setMessages,
        setPreviewForm

    } = useAiChat();

    useEffect(() => {
        setMessages([]); // Clear global context for new chats

        const initialPrompt = location.state?.initialPrompt;
        if (initialPrompt) {
            // Clear location state so it doesn't trigger again on back navigation
            window.history.replaceState({}, document.title);

            const triggerSend = async () => {
                try {
                    const text = initialPrompt.trim();
                    const res = await http.post("/conversations", { message: text });
                    const conversation: { id: string, content: string } = res.data.conversation;
                    setFirstMessage(text);
                    navigate(`/c/${conversation.id}`, { replace: true });
                } catch (error) {
                    console.error("Error sending message:", error);
                }
            };
            triggerSend();
        }
    }, [location.state, setMessages, setFirstMessage, navigate]);

    const checkAndSend = async () => {
        if (inputText.trim()) {
            try {
                const text = inputText.trim();
                const res = await http.post("/conversations", { message: text });
                const conversation: { id: string, content: string } = res.data.conversation;
                setFirstMessage(text)
                navigate(`/c/${conversation.id}`);
                // setInputText("")
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

    const handleSend = () => {
        checkAndSend();
    }

    return (
        <Group className='__chat-multi-panel' orientation='horizontal' >

            <Panel className='__chat-compo'  >
                {/* <div className='__chat-area' >
                    <MessageList messages={messages} status={status} />
                </div> */}

                {/* {messages.length === 0 && <h4 className='__chat-compo--header'>What form would you like to create today?</h4>} */}
                {/* textarea */}
                {/* <div className='__chat-compo-area move-down' ref={chatComponentRef} > */}
                <div className='__chat-compo-area ' ref={chatComponentRef} >
                    <h4 className='__chat-compo--header'>What form would you like to create today?</h4>
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
                            className={`__chat-compo-textarea ${inputText.split("\n").length > 1
                                ? "expanded"
                                : ""
                                }`}
                            placeholder={messages.length > 0 ?
                                `Reply` :
                                `Ask Formiq to generate a form.`}
                        />
                        <span>
                            {status === "streaming" ?
                                <span className='__chat-compo-icon streaming' >
                                    <VscLoading size={20} className='icon' />
                                </span> :
                                <BiSend size={20} className='__chat-compo-icon' onClick={handleSend} />}
                        </span>
                    </div>
                </div>
            </Panel>


            {/* 
            //  we dont need this but still im leaving this here.
            {
                previewForm &&
                <>
                    <Separator />
                    <Panel maxSize={"60%"} className='__preview-panel'>
                        <PreviewForm />
                    </Panel>
                </>
            } */}

        </Group>
    )
}

export default ChatComponent