import React from 'react'
import "../styles/previewForm.css"
import Form from './Form'
import { useAiChat } from '../providers/AiChatProvider'

// const formSchema = {
//     title: "Gym Membership Form",
//     fields: [
//         {
//             type: "text",
//             name: "full_name",
//             label: "Full Name",
//             placeholder: "Enter your full name"
//         },
//         {
//             type: "email",
//             name: "email",
//             label: "Email Address",
//             placeholder: "example@example.com"
//         },
//         {
//             type: "password",
//             name: "password",
//             label: "Password",
//             placeholder: "Enter a strong password"
//         },
//         {
//             type: "select",
//             name: "membership_type",
//             label: "Membership Type",
//             options: [
//                 { value: "monthly", label: "Monthly" },
//                 { value: "yearly", label: "Yearly" },
//                 { value: "student", label: "Student" }
//             ]
//         },
//         {
//             type: "textarea",
//             name: "emergency_contact",
//             label: "Emergency Contact",
//             placeholder: "Name and relationship to you (e.g., parent, partner, etc.)"
//         },
//         {
//             type: "date",
//             name: "date_of_birth",
//             label: "Date of Birth",
//             min: "1900-01-01",
//             max: "2000-01-01"
//         },
//         {
//             type: "checkbox",
//             name: "agreement",
//             label: "I agree to the gym's terms and conditions."
//         }
//     ]
// }

const formSchema = { "title": "Gym Membership Form", "fields": [{ "type": "text", "name": "full_name", "label": "Full Name", "placeholder": "Enter your full name" }, { "type": "email", "name": "email", "label": "Email Address", "placeholder": "example@example.com" }, { "type": "password", "name": "password", "label": "Password", "placeholder": "Enter a strong password" }, { "type": "select", "name": "membership_type", "label": "Membership Type", "options": [{ "value": "monthly", "label": "Monthly" }, { "value": "yearly", "label": "Yearly" }, { "value": "student", "label": "Student" }] }, { "type": "textarea", "name": "emergency_contact", "label": "Emergency Contact", "placeholder": "Name and relationship to you (e.g., parent, partner, etc.)" }, { "type": "date", "name": "date_of_birth", "label": "Date of Birth", "min": "1900-01-01", "max": "2000-01-01" }, { "type": "checkbox", "name": "agreement", "label": "I agree to the gym's terms and conditions." }] }

const PreviewForm = () => {
    const { previewForm } = useAiChat();

    return (
        <div className='__preview-form' >

            <div className='__preview-form-header' >
                <div className='__toggle' >

                </div>
            </div>

            <div className='__preview-form--body' >
                {/* <Form formSchema={formSchema} /> */}
                <Form formSchema={previewForm} />
            </div>

            <div className='__preview-form--bottom' >
                <button className='button' >Continue & Edit</button>
            </div>

        </div>
    )
}

export default PreviewForm