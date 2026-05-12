import React, { useMemo } from 'react'
import "../styles/Form.css"
import { useAiChat } from "../providers/AiChatProvider"
import Loading from "./Loading"

type FormType = {
    formSchema: string
}

// @ts-ignore
enum FieldType {
    TEXT = "text",
    BUTTON = "button",
    EMAIL = "email",
    PASSWORD = "password",
    TEXTAREA = "textarea",
    DATE = "date",
    CHECKBOX = "checkbox",
    SELECT = "select",
    RADIO = "radio"
}

type ParseFormSchemaType = {
    title: string,
    fields: [
        {
            type: Exclude<FieldType, FieldType.SELECT>,
            name: string,
            label: string,
            placeholder: string,
        } |
        {
            type: 'select',
            name: string,
            label: string,
            options: [{
                value: string,
                label: string
            }]
        }
    ]
}

const Form = ({ formSchema }: any) => {
    const { previewForm } = useAiChat();

    console.log("")
    console.log({ previewForm })
    console.log("")

    // const parsedFormSchema: ParseFormSchemaType = formSchema.fields
    const parsedFormSchema = useMemo(() => {
        if (!previewForm || !previewForm?.form) return null;

        try {
            return previewForm;
        } catch {
            return null;
        }
    }, [previewForm]);

    if (!parsedFormSchema) {
        return <p>No Data.</p>
    }

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);

        console.log(Object.fromEntries(formData.entries()))

        // for (const [key, value] of formData.entries()) {
        //     console.log(key, value);
        // }
    };

    return (
        <div className='__form-container' >
            <pre style={{ whiteSpace: "collapse" }} >
                {/* {formSchema}
                <br />
                <br /> */}
                <h2>
                    <center>
                        {parsedFormSchema?.title || "No Title"}
                    </center>
                </h2>
            </pre>

            <form action="" className='__form' onSubmit={handleFormSubmit} >
                {(parsedFormSchema.form || [])?.map((f: any) => {
                    const type = f.type;

                    if (type === "text" || type === "password" || type === "checkbox" || type === "radio")
                        return <>
                            <div className={`__form-field ${type === "checkbox" ? "__type-radio" : ""}`} >
                                <label htmlFor="" className='__form-label' >{f.label}</label>
                                <input type={type} className='__form-input' name={f.name} placeholder={f.placeholder} />
                            </div>
                        </>
                    else if (type === "select") {
                        return (
                            <div className='__form-field' >
                                <label htmlFor="" className='__form-label' >{f.label}</label>
                                <select name={f.name} className="__form-input"  >
                                    {
                                        f.options.map((option: any) => (
                                            <option value={option}>{option}</option>
                                        ))
                                    }
                                </select>
                            </div>
                        )
                    }

                })}
                <div className='__form-field' >
                    <button className='__type-button' type='submit' >Submit</button>
                </div>
            </form>
        </div>
    )
}

export default Form