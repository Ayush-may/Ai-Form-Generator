import React, { memo } from "react"
import { RiLoaderLine } from "react-icons/ri"
import "../styles/Loading.css"

type LoadingType = {
    text?: string
}

const Loading = memo(({ text = "Loading..." }: LoadingType) => {
    return (
        <div className="__loading">
            <span className="spinner">
                <RiLoaderLine size={18} />
            </span>

            <span className="loading-text">
                {text}
            </span>
        </div>
    )
})

export default Loading