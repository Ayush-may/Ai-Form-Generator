import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import {
    FiArrowRight,
    FiZap,
    FiMessageSquare,
    FiGlobe,
    FiBarChart2,
    FiCheckCircle,
    FiPlay,
    FiLogOut
} from "react-icons/fi";
import "../styles/LandingPage.css";
import squareLogo from "../assets/squareLogo.svg"

const LandingPage = () => {
    const { token, logout } = useAuth();
    const navigate = useNavigate();
    const [quickPrompt, setQuickPrompt] = useState("");

    const handleQuickGenerate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!quickPrompt.trim()) return;

        if (token) {
            navigate("/new", { state: { initialPrompt: quickPrompt } });
        } else {
            sessionStorage.setItem("pendingPrompt", quickPrompt);
            navigate("/login");
        }
    };

    return (
        <main className="landing-main">
            {/* Header/Nav */}
            <nav className="landing-nav" id="landing-navbar">
                <div className="nav-logo">
                    {/* <span className="logo-icon"><FiZap /></span> */}
                    <span className="logo-icon">
                        <img src={squareLogo} alt="logo" />
                    </span>
                    <span className="logo-text">ChatForm</span>
                </div>

                <div className="nav-links">
                    <a href="#features">Features</a>
                    <a href="#how-it-works">How It Works</a>
                </div>

                <div className="nav-actions">
                    {token ? (
                        <>
                            <Link to="/new" className="nav-btn nav-btn-primary">
                                Dashboard
                            </Link>
                            <button onClick={logout} className="nav-btn nav-btn-outline" title="Logout" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px 12px' }}>
                                <FiLogOut size={16} />
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="nav-btn nav-btn-primary">
                            Sign In
                        </Link>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <section className="section __hero-section" id="hero">
                <div className="__big-circle"></div>
                <div className="__big-circle-secondary"></div>

                <div className="radiant-circle-bg">
                    <div className="radiant-ring-1"></div>
                    <div className="radiant-ring-2"></div>
                    <div className="radiant-ring-3"></div>
                </div>

                <div className="__center-container">
                    {/* <div className="badge-wrapper">
                        <span className="hero-badge">
                            <span className="pulse-dot"></span> Powered by Gemini 3.5
                        </span>
                    </div> */}

                    <h1 className="__center-header-text">
                        Generate Forms <br />
                        <span className="gradient-accent">In Seconds with AI</span>
                    </h1>

                    <p className="__center-sub-header-text">
                        Transform natural language prompts into beautifully designed, interactive forms.
                        Chat with our AI assistant to customize layouts, fields, and validations effortlessly.
                    </p>

                    {/* Quick Prompt Generator Form */}
                    <form onSubmit={handleQuickGenerate} className="quick-prompt-form">
                        <div className="prompt-input-wrapper">
                            <input
                                type="text"
                                placeholder="Describe your form (e.g., 'A registration form for a photography workshop')"
                                value={quickPrompt}
                                onChange={(e) => setQuickPrompt(e.target.value)}
                                className="prompt-input"
                            />
                            <button type="submit" className="prompt-submit-btn">
                                Generate <FiArrowRight className="btn-icon" />
                            </button>
                        </div>
                    </form>

                    {/* Mock Showcase */}
                    <div className="showcase-container">
                        <div className="showcase-glass-card">
                            <div className="card-header-bar">
                                <span className="window-dot red"></span>
                                <span className="window-dot yellow"></span>
                                <span className="window-dot green"></span>
                                <span className="window-title">AI Form Editor Preview</span>
                            </div>

                            <div className="card-editor-content">
                                {/* Left Side: Mock chat */}
                                <div className="mock-chat-pane">
                                    <div className="chat-bubble user">
                                        Create a registration form for my photography workshop.
                                    </div>
                                    <div className="chat-bubble ai">
                                        <div className="ai-typing-icon"><FiZap className="spin-icon" /></div>
                                        <span>I've built the Photography Workshop Registration Form. I included fields for name, email, camera type, and professional experience level.</span>
                                    </div>
                                    <div className="chat-bubble user">
                                        Make camera type optional and add a nice gradient submit button.
                                    </div>
                                    <div className="chat-bubble ai">
                                        <div className="ai-typing-icon"><FiZap /></div>
                                        <span>Done! Updated camera type field to optional and styled the submit button. Let me know if you need more edits!</span>
                                    </div>
                                </div>

                                {/* Right Side: Mock form */}
                                <div className="mock-form-pane">
                                    <div className="mock-form-header">
                                        <h3>Photography Workshop</h3>
                                        <p>Register to secure your spot</p>
                                    </div>
                                    <div className="mock-form-body">
                                        <div className="mock-form-field">
                                            <label>Full Name <span className="req">*</span></label>
                                            <input type="text" placeholder="John Doe" disabled />
                                        </div>
                                        <div className="mock-form-field">
                                            <label>Email Address <span className="req">*</span></label>
                                            <input type="email" placeholder="john@example.com" disabled />
                                        </div>
                                        <div className="mock-form-field">
                                            <label>Camera Brand <span className="opt">(Optional)</span></label>
                                            <select disabled>
                                                <option>Sony</option>
                                                <option>Canon</option>
                                                <option>Nikon</option>
                                                <option>Other / None</option>
                                            </select>
                                        </div>
                                        <div className="mock-form-field">
                                            <label>Experience Level <span className="req">*</span></label>
                                            <div className="mock-radio-group">
                                                <label className="mock-radio"><input type="radio" checked disabled /> Beginner</label>
                                                <label className="mock-radio"><input type="radio" disabled /> Professional</label>
                                            </div>
                                        </div>
                                        <button className="mock-submit-btn" disabled>
                                            Complete Registration
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="landing-section" id="features">
                <div className="section-header">
                    <span className="section-tag">Features</span>
                    <h2>Designed for Speed, Styled for Impact</h2>
                    <p>Build, share, and track conversational or standard forms in record time with intelligent AI generation.</p>
                </div>

                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon"><FiZap /></div>
                        <h3>AI Prompt Generation</h3>
                        <p>Write what you need in plain English. Our AI analyzes your intent and constructs the schema automatically.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon"><FiMessageSquare /></div>
                        <h3>Chat-Based Tweaking</h3>
                        <p>No clunky drag-and-drop. Simply chat with the AI to refine fields, change options, and toggle validation rules.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon"><FiGlobe /></div>
                        <h3>Instant Deployment</h3>
                        <p>Publish forms instantly. Every form gets a public link to collect user data immediately without hosting hurdles.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon"><FiBarChart2 /></div>
                        <h3>Submissions Dashboard</h3>
                        <p>Access submitted responses instantly in a structured layout. View analytical reports and export data.</p>
                    </div>
                </div>
            </section>

            {/* How it works Section */}
            <section className="landing-section alt-bg" id="how-it-works">
                <div className="section-header">
                    <span className="section-tag">Workflow</span>
                    <h2>How It Works</h2>
                    <p>Generate, edit, and share forms in three simple steps.</p>
                </div>

                <div className="workflow-steps">
                    <div className="workflow-step">
                        <div className="step-num">1</div>
                        <h3>Describe</h3>
                        <p>Describe your target form in natural language prompt (e.g. "RSVP form for a wedding invitation").</p>
                    </div>
                    <div className="workflow-step">
                        <div className="step-num">2</div>
                        <h3>Refine</h3>
                        <p>Use conversational editing. Ask the AI to change styles, add complex fields, or adjust logic rules.</p>
                    </div>
                    <div className="workflow-step">
                        <div className="step-num">3</div>
                        <h3>Share</h3>
                        <p>Save and deploy your form. Share the generated public link to start collecting submissions instantly.</p>
                    </div>
                </div>
            </section>

            {/* Call To Action Banner */}
            <section className="cta-banner">
                <div className="cta-glow"></div>
                <div className="cta-content">
                    <h2>Ready to Build Smarter Forms?</h2>
                    <p>Experience the power of generative AI in interface building today. No credit card required.</p>
                    <Link to="/new" className="cta-button">
                        Start Generating Now <FiPlay className="btn-icon-right" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="footer-top">
                    <div className="footer-brand">
                        {/* <span className="brand-logo"><FiZap /></span> */}
                        <span>ChatForm</span>
                    </div>
                    <div className="footer-links">
                        <a href="#features">Features</a>
                        <a href="#how-it-works">How It Works</a>
                        <Link to="/login">Sign In</Link>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} ChatForm All rights reserved.</p>
                    <p className="footer-subtext">Built by Ayush Sharma.</p>
                </div>
            </footer>
        </main >
    );
};

export default LandingPage;