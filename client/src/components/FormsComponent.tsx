import React, { useEffect, useMemo, useState } from "react";
import {
    FiSearch,
    FiMoreVertical,
    FiExternalLink,
    FiEdit2,
    FiCopy,
    FiTrash2,
    FiBarChart2
} from "react-icons/fi";
import "../styles/FormsComponent.css";

const mockForms = [
    {
        id: 1,
        name: "Customer Feedback Form",
        submissions: 124,
        liveLink: "https://yourapp.com/forms/customer-feedback"
    },
    {
        id: 2,
        name: "Job Application Form",
        submissions: 89,
        liveLink: "https://yourapp.com/forms/job-application"
    },
    {
        id: 3,
        name: "Event Registration Form",
        submissions: 245,
        liveLink: "https://yourapp.com/forms/event-registration"
    },
    {
        id: 4,
        name: "Lead Capture Form",
        submissions: 52,
        liveLink: "https://yourapp.com/forms/lead-capture"
    }
];

function FormsComponent() {
    const [search, setSearch] = useState("");
    const [openMenu, setOpenMenu] = useState<number | null>(null);

    const filteredForms = useMemo(() => {
        return mockForms.filter((form) =>
            form.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [search]);

    useEffect(() => {
        const closeMenu = () => setOpenMenu(null);
        document.addEventListener("click", closeMenu);

        return () => {
            document.removeEventListener("click", closeMenu);
        };
    }, []);

    return (
        <div className="forms-wrapper">
            <div className="forms-header">
                <div className="search-box">
                    <FiSearch size={18} />
                    <input
                        type="text"
                        placeholder="Search forms..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="forms-grid">
                {filteredForms.map((form) => (
                    <div key={form.id} className="form-card">
                        <div className="form-card-top">
                            <h3>{form.name}</h3>

                            <div className="menu-wrapper">
                                <button
                                    className="menu-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenMenu(openMenu === form.id ? null : form.id);
                                    }}
                                >
                                    <FiMoreVertical size={18} />
                                </button>

                                {openMenu === form.id && (
                                    <div
                                        className="dropdown-menu"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <button>
                                            <FiEdit2 />
                                            Edit Form
                                        </button>

                                        <button>
                                            <FiBarChart2 />
                                            View Responses
                                        </button>

                                        <button>
                                            <FiCopy />
                                            Duplicate
                                        </button>

                                        <button className="delete-option">
                                            <FiTrash2 />
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <p className="submission-count">
                            {form.submissions} submissions
                        </p>

                        <div className="form-card-actions">
                            <a
                                href={form.liveLink}
                                target="_blank"
                                rel="noreferrer"
                                className="live-icon-btn"
                                title="Open Live Form"
                            >
                                <FiExternalLink size={18} />
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {filteredForms.length === 0 && (
                <div className="empty-state">
                    No forms found.
                </div>
            )}
        </div>
    );
}

export default FormsComponent;