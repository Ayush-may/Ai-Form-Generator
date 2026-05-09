import { memo, useDeferredValue, useEffect, useMemo } from "react"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import Loading from "./Loading"
import { IoIosArrowForward } from "react-icons/io"

type Props = {
    message: any
    status: any
    setPreviewForm: (form: string | null) => void
}

const MessageMarkdown = memo(({ message, setPreviewForm }: Props) => {

    /**
     * normal text parts
     */
    const textContent = useMemo(() => {

        // database message
        if (typeof message?.content === "string") {
            return message.content
        }

        // ai-sdk streaming text
        if (!message?.parts) return ""

        return message.parts
            .filter((p: any) => p.type === "text")
            .map((p: any) => p.text ?? "")
            .join("")

    }, [message])

    /**
     * all tool parts
     */
    const toolParts = useMemo(() => {
        if (!message?.parts) return []

        return message.parts.filter(
            (p: any) => p.type?.startsWith("tool-")
        )
    }, [message])

    /**
     * deferred markdown
     */
    const deferredText = useDeferredValue(textContent)

    /**
     * tool renderer
     */
    const renderTool = (tool: any, index: number) => {

        const toolName = tool.type.replace("tool-", "")
        const isLoading = tool.state !== "output-available"

        /**
         * loading UI
         */
        if (isLoading) {
            return (
                <div key={index} className="__box">
                    <Loading text={`${toolName} is running...`} />
                </div>
            )
        }

        /**
         * TOOL: createForm
         */
        if (toolName === "createForm") {

            const form = tool?.output?.form?.form
            const message = tool?.output?.form?.message

            // preview sync
            if (form) {
                setPreviewForm(
                    JSON.stringify(form, null, 2)
                )
            }

            return (
                <div key={index}>

                    {message && (
                        <Markdown remarkPlugins={[remarkGfm]}>
                            {message}
                        </Markdown>
                    )}

                    <div className="__box __box-center"
                        onClick={() => setPreviewForm(JSON.stringify(form, null, 2))}
                    >
                        Click here to see preview
                        <IoIosArrowForward />
                    </div>

                </div>
            )
        }

        /**
         * fallback for unknown tools
         */
        return (
            <div key={index} className="__box">
                <pre>
                    {JSON.stringify(tool.output, null, 2)}
                </pre>
            </div>
        )
    }

    return (
        <div
            className={`__chat-area-message ${message.role === "user"
                ? "me"
                : "ai"
                }`}
        >

            {/* markdown text */}
            {deferredText && (
                <Markdown remarkPlugins={[remarkGfm]}>
                    {deferredText}
                </Markdown>
            )}

            {/* tools */}
            {toolParts.map(renderTool)}

        </div>
    )
})

export default MessageMarkdown