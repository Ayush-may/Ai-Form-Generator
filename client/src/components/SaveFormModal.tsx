import React, { useEffect, useState } from "react";
import "../styles/SaveFormModal.css";
import http from "../libs/http";
import { useAiChat } from "../providers/AiChatProvider";

type SavePayload = {
    formName: string;
    slug: string;
};

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSave?: (data: SavePayload) => void;
    title: string,
};

const SaveFormModal = ({
    isOpen,
    onClose,
    onSave,
    title,
}: ModalProps) => {

    const { previewForm } = useAiChat();
    const [step, setStep] = useState(2);
    const [formName, setFormName] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("draft");
    const [visibility, setVisibility] = useState<"public" | "private">("public");

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                handleClose();
            }
        };

        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setFormName("");
            setSlug("");
        }
    }, [isOpen]);

    const handleClose = () => {
        setStep(1);
        setFormName("");
        setSlug("");
        onClose();
    };

    const handleNext = () => {
        setStep(2);
    };

    const handleSave = async () => {
        if (!formName.trim() || !slug.trim()) {
            alert("Please fill all required fields.");
            return;
        }

        try {
            // console.log(previewForm)
            // return

            const payload = {
                name: formName.trim(),
                description: description.trim(),
                slug: slug.trim().toLowerCase().replace(/\s+/g, "-"),
                schema: JSON.stringify(previewForm),
                status,
                visibility,
            };

            const response = await http.post("/form", payload);

            console.log("FORM SAVED:", response.data);

            alert("form is saved!")

            onSave?.(response.data.form);

            handleClose();
        } catch (error) {
            console.error(error);
            alert("Failed to save form.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="__modal-overlay" onClick={handleClose}>
            <div
                className="__modal"
                onClick={(e) => e.stopPropagation()}
            >
                {/* header */}
                <div className="__modal-header">
                    <h3 className="__modal-title">
                        Save Generated Form
                    </h3>

                    <button
                        className="__modal-close"
                        onClick={handleClose}
                    >
                        ×
                    </button>
                </div>

                {/* body */}
                <div className="__modal-body">

                    {step === 1 && (
                        <div className="__save-step">
                            <p className="__modal-text">
                                Do you want to save this generated form and continue editing later?
                            </p>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="__save-step">
                            <div className="__modal-field">
                                <label className="__modal-label">
                                    Form Name
                                </label>

                                <input
                                    type="text"
                                    className="__modal-input"
                                    placeholder="e.g. Patient Intake Form"
                                    value={formName}
                                    onChange={(e) => setFormName(e.target.value)}
                                />
                            </div>

                            <div className="__modal-field">
                                <label className="__modal-label">
                                    Description
                                </label>

                                <textarea
                                    className="__modal-input __modal-textarea"
                                    placeholder="Short description about this form..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div className="__modal-field">
                                <label className="__modal-label">
                                    Unique URL Name
                                </label>

                                <input
                                    type="text"
                                    className="__modal-input"
                                    placeholder="e.g. patient-intake-form"
                                    value={slug}
                                    onChange={(e) =>
                                        setSlug(
                                            e.target.value
                                                .toLowerCase()
                                                .replaceAll(" ", "-")
                                        )
                                    }
                                />

                                <small className="__modal-hint">
                                    Your form URL: /forms/{slug || "your-form-name"}
                                </small>
                            </div>

                            <div className="__modal-row">
                                <div className="__modal-field">
                                    <label className="__modal-label">
                                        Status
                                    </label>

                                    <select
                                        className="__modal-input"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="published">Published</option>
                                    </select>
                                </div>

                                <div className="__modal-field">
                                    <label className="__modal-label">
                                        Visibility
                                    </label>

                                    <select
                                        className="__modal-input"
                                        value={visibility}
                                        onChange={(e) =>
                                            setVisibility(e.target.value as "public" | "private")
                                        }
                                    >
                                        <option value="public">Public</option>
                                        <option value="private">Private</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* footer */}
                <div className="__modal-footer">

                    <button
                        className="__modal-btn __modal-btn-secondary"
                        onClick={handleClose}
                    >
                        Cancel
                    </button>

                    {step === 1 && (
                        <button
                            className="__modal-btn __modal-btn-primary"
                            onClick={handleNext}
                        >
                            Continue
                        </button>
                    )}

                    {step === 2 && (
                        <button
                            className="__modal-btn __modal-btn-primary"
                            onClick={handleSave}
                        >
                            Save Form
                        </button>
                    )}

                </div>
            </div>
        </div>
    );
};

export default SaveFormModal;