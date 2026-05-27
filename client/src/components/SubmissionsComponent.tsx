import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiDownload, FiSearch, FiDatabase } from "react-icons/fi";
import { toast } from "sonner";
import http from "../libs/http";
import Breadcrumb from "./Breadcrumb";
import "../styles/SubmissionsComponent.css";

const SubmissionsComponent = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const formId = searchParams.get("formId");

    const [form, setForm] = useState<any>(null);
    const [forms, setForms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (formId) {
            fetchFormSubmissions();
        } else {
            fetchAllForms();
        }
    }, [formId]);

    const fetchFormSubmissions = async () => {
        setLoading(true);
        try {
            const { data } = await http.get(`/form/submissions/${formId}`);
            setForm(data);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to fetch submissions");
            navigate("/submissions");
        } finally {
            setLoading(false);
        }
    };

    const fetchAllForms = async () => {
        setLoading(true);
        try {
            const { data } = await http.get("/form");
            setForms(data);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to fetch forms");
        } finally {
            setLoading(false);
        }
    };

    // Dynamically compile columns based on schema fields + any extra fields found in responseData
    const columns = useMemo(() => {
        if (!form) return [];

        const cols: { key: string; label: string }[] = [];
        const addedKeys = new Set<string>();

        // Add columns from schema fields
        if (form.schema && Array.isArray(form.schema.form)) {
            form.schema.form.forEach((field: any) => {
                if (field.name) {
                    cols.push({
                        key: field.name,
                        label: field.label || field.name,
                    });
                    addedKeys.add(field.name);
                }
            });
        }

        // Fallback: Add any other keys present in submissions responseData (e.g. if schema changed)
        if (form.submissions && Array.isArray(form.submissions)) {
            form.submissions.forEach((sub: any) => {
                if (sub.responseData && typeof sub.responseData === "object") {
                    Object.keys(sub.responseData).forEach((k) => {
                        if (!addedKeys.has(k)) {
                            cols.push({
                                key: k,
                                label: k.charAt(0).toUpperCase() + k.slice(1),
                            });
                            addedKeys.add(k);
                        }
                    });
                }
            });
        }

        return cols;
    }, [form]);

    // Filter submissions based on search input
    const filteredSubmissions = useMemo(() => {
        if (!form || !form.submissions) return [];
        if (!search.trim()) return form.submissions;

        const lowerSearch = search.toLowerCase();
        return form.submissions.filter((sub: any) => {
            return Object.values(sub.responseData || {}).some((val) =>
                String(val).toLowerCase().includes(lowerSearch)
            );
        });
    }, [form, search]);

    // CSV Export functionality
    const exportToCSV = () => {
        if (!form || !filteredSubmissions || filteredSubmissions.length === 0) return;

        // Header row
        const headerRow = [...columns.map((col) => col.label), "Submitted At"];

        // Data rows
        const rows = filteredSubmissions.map((sub: any) => {
            const rowData = columns.map((col) => {
                const val = sub.responseData?.[col.key];
                const stringVal = val !== undefined && val !== null ? String(val) : "";
                // Escape quotes by doubling them, and wrap in quotes
                return `"${stringVal.replace(/"/g, '""')}"`;
            });
            rowData.push(`"${new Date(sub.createdAt).toLocaleString()}"`);
            return rowData.join(",");
        });

        const csvString = [headerRow.join(","), ...rows].join("\r\n");
        const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `${form.name.replace(/\s+/g, "_")}_submissions.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("CSV file exported successfully!");
    };

    if (loading) {
        return (
            <div className="submissions-wrapper">
                <div className="spinner-container">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    // Individual form submission list view
    if (formId && form) {
        return (
            <div className="submissions-wrapper">
                <div className="submissions-header">
                    <div className="submissions-header-left">
                        <button className="back-btn" onClick={() => navigate("/submissions")}>
                            <FiArrowLeft size={18} />
                        </button>
                        <h2 className="submissions-title">{form.name} Submissions</h2>
                    </div>
                </div>

                <Breadcrumb
                    items={[
                        { label: "Home", href: "/" },
                        { label: "Submissions", href: "/submissions" },
                        { label: form.name }
                    ]}
                />

                <div className="submissions-stats">
                    <div className="stat-card">
                        <h4>Total Responses</h4>
                        <p>{form.submissions?.length || 0}</p>
                    </div>
                </div>

                <div className="submissions-actions">
                    <div className="search-box">
                        <FiSearch size={18} />
                        <input
                            type="text"
                            placeholder="Search submissions..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {form.submissions && form.submissions.length > 0 && (
                        <button className="export-btn" onClick={exportToCSV}>
                            <FiDownload size={16} /> Export to CSV
                        </button>
                    )}
                </div>

                {filteredSubmissions.length > 0 ? (
                    <div className="table-container">
                        <table className="submissions-table">
                            <thead>
                                <tr>
                                    {columns.map((col) => (
                                        <th key={col.key}>{col.label}</th>
                                    ))}
                                    <th>Submitted At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSubmissions.map((sub: any) => (
                                    <tr key={sub.id}>
                                        {columns.map((col) => (
                                            <td key={col.key}>
                                                {sub.responseData?.[col.key] !== undefined
                                                    ? String(sub.responseData[col.key])
                                                    : "-"}
                                            </td>
                                        ))}
                                        <td>{new Date(sub.createdAt).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="empty-submissions">
                        <div className="empty-icon">
                            <FiDatabase />
                        </div>
                        <h3>No Submissions Yet</h3>
                        <p>This form doesn't have any submission records matching your search.</p>
                    </div>
                )}
            </div>
        );
    }

    // Default submissions dashboard: show list of forms to choose from
    return (
        <div className="submissions-wrapper">
            <div className="submissions-header">
                <h2 className="submissions-title">Submissions Dashboard</h2>
            </div>

            <Breadcrumb
                items={[
                    { label: "Home", href: "/" },
                    { label: "Submissions" }
                ]}
            />

            <div className="forms-list-grid">
                {forms.map((f) => (
                    <div
                        key={f.id}
                        className="form-select-card"
                        onClick={() => navigate(`/submissions?formId=${f.id}`)}
                    >
                        <h3>{f.name}</h3>
                        <p>{f.description || "No description provided."}</p>
                        <div className="card-footer">
                            <span>Submissions Count</span>
                            <span className="badge">{f.submissionsCount}</span>
                        </div>
                    </div>
                ))}

                {forms.length === 0 && (
                    <div className="empty-submissions" style={{ gridColumn: "1 / -1" }}>
                        <div className="empty-icon">
                            <FiDatabase />
                        </div>
                        <h3>No Forms Found</h3>
                        <p>Create a form first to see and manage its submissions.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubmissionsComponent;