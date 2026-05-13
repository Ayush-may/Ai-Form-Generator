import React, { useMemo } from 'react'
import "../styles/Form.css"
import { useAiChat } from "../providers/AiChatProvider"

const Form = () => {
    const { previewForm } = useAiChat();

    const parsedFormSchema = useMemo(() => {
        if (!previewForm || !previewForm?.form) return null;
        return previewForm;
    }, [previewForm]);

    if (!parsedFormSchema) {
        return <p>No Data.</p>
    }

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const formData = new FormData(form);

        console.log(Object.fromEntries(formData.entries()));
    };

    const renderField = (f: any) => {
        const type = f.type;

        const spanClass =
            type === "textarea"
                ? "__span-full"
                : f.span === 2
                    ? "__span-full"
                    : "__span-half";

        if (
            ["text", "email", "password", "checkbox", "radio", "number", "tel", "date"].includes(type)
        ) {
            return (
                <div
                    key={f.name}
                    className={`__form-field ${spanClass} ${type === "checkbox" || type === "radio" ? "__type-inline" : ""}`}
                >
                    <label className='__form-label'>
                        {f.label}
                        {f.required && <span className="__required">*</span>}
                    </label>

                    <input
                        type={type}
                        className='__form-input'
                        name={f.name}
                        placeholder={f.placeholder || ""}
                        required={f.required}
                    />
                </div>
            )
        }

        if (type === "textarea") {
            return (
                <div key={f.name} className={`__form-field ${spanClass}`}>
                    <label className='__form-label'>
                        {f.label}
                        {f.required && <span className="__required">*</span>}
                    </label>

                    <textarea
                        className='__form-input __form-textarea'
                        name={f.name}
                        placeholder={f.placeholder || ""}
                        required={f.required}
                    />
                </div>
            )
        }

        if (type === "select") {
            return (
                <div key={f.name} className={`__form-field ${spanClass}`}>
                    <label className='__form-label'>
                        {f.label}
                        {f.required && <span className="__required">*</span>}
                    </label>

                    <select
                        name={f.name}
                        className="__form-input"
                        required={f.required}
                        defaultValue=""
                    >
                        <option value="" disabled>
                            Select {f.label}
                        </option>

                        {f.options?.map((option: string) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
            )
        }

        return null;
    };

    return (
        <div className='__form-container'>
            <h2 className='__form-title'>
                {parsedFormSchema.title || "No Title"}
            </h2>

            <form className='__form' onSubmit={handleFormSubmit} noValidate>
                {(parsedFormSchema.form || []).map(renderField)}

                <div className='__form-field __span-full'>
                    <button className='__type-button' type='submit'>
                        Submit
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Form