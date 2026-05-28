import "../styles/LandingPage.css"

const LandingPage = () => {
    return (
        <main>

            <nav >
                <div className="left-side" >
                    <button>
                        Home
                    </button>
                    <button>
                        Features
                    </button>
                </div>

                <div className="right-side" >
                    <button>
                        Login | SignUp
                    </button>
                </div>
            </nav>

            <section className="section __hero-section" >

                <div className="__center-container" >
                    <p className="__center-header-text"  >
                        Generate Form <br />In Seconds
                    </p>
                    <p className="__center-sub-header-text">
                        Transform simple prompts into fully functional forms with the power of AI. Build faster, customize effortlessly, and deliver seamless user experiences.
                    </p>
                    <button className="__generate-now-btn" >Generate Now</button>
                </div>

                <div className="__floating-card-1" >
                    <div className="floating-relative" >
                        <div className="floating-body" ></div>
                    </div>
                </div>

                <div className="__big-circle" ></div>
            </section>

            <section className="section" >
                sasdas
            </section>

        </main>
    )
}

export default LandingPage