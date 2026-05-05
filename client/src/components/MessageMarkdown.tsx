import { memo, useEffect, useMemo, useDeferredValue } from "react"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import Loading from "./Loading"
import { IoIosArrowForward } from "react-icons/io"
type Props = {
  message: any
  status: any
  setPreviewForm: (form: string | null) => void
}

function extractForm(text: string) {
  const start = text.indexOf("```form")

  if (start === -1) {
    return { text, form: null, loading: false }
  }

  const before = text.slice(0, start)

  const end = text.indexOf("```", start + 7)

  // streaming
  if (end === -1) {
    return {
      text: before,
      form: text.slice(start + 7),
      loading: true
    }
  }

  return {
    text: before,
    form: text.slice(start + 7, end),
    loading: false
  }
}

const MessageMarkdown = memo(({ message, setPreviewForm }: Props) => {

  const text = useMemo(() => {
    if (message.parts) {
      return message.parts
        .filter((p: any) => p.type === "text")
        .map((p: any) => p.text ?? "")
        .join("")
    }
    return message.content || ""
  }, [message.parts, message.content])

  const { text: markdownText, form, loading } = useMemo(() => {
    return extractForm(text)
  }, [text])

  const deferredMarkdownText = useDeferredValue(markdownText)

  // show form in the preview area
  useEffect(() => {
    if (form && !loading) {
      setPreviewForm(form)
    }
  }, [form, loading])

  return (
    <div className={`__chat-area-message ${message.role === "user" ? "me" : "ai"}`}>

      {/* normal markdown */}
      {deferredMarkdownText && (
        <Markdown remarkPlugins={[remarkGfm]}>
          {deferredMarkdownText}
        </Markdown>
      )}

      {/* loading box */}
      {loading && (
        <div className="__box" >
          <Loading text="Generating form..." />
        </div>
      )}


      {form && !loading && (
        <div className="__box __box-center" >
          Click here to see preview <IoIosArrowForward />
        </div>
      )}

      {/* finished form */}
      {/* {form && !loading && (
        <Markdown remarkPlugins={[remarkGfm]}>
          {form}
        </Markdown>
      )} */}

    </div>
  )
})

export default MessageMarkdown