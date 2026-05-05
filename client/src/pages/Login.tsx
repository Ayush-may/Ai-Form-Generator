"use client";

import React, { useState } from "react";
import "../styles/Login.css";
// import { useRouter } from "next/navigation";
import http from "../libs/http";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

const Login = () => {
    const { storeToken } = useAuth();

    const [isRegister, setIsRegister] = useState(false);
    const [isOtpMode, setIsOtpMode] = useState(false);
    const [otp, setOtp] = useState("");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();


    const handleResendOtp = async () => {
        if (!email) return toast.error("Email is required");
        setIsLoading(true);
        try {
            await http.post("/users/resend-otp", { email });
            toast.success("New OTP sent to your email!");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to resend OTP");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isOtpMode) {
            if (!otp) return toast.error("Please enter OTP");
            setIsLoading(true);
            try {
                await http.post("/users/verify-otp", { email, otp });
                toast.success("Email verified! Please login.");
                setIsOtpMode(false);
                setIsRegister(false);
                setOtp("");
                setPassword("");
            } catch (err: any) {
                toast.error(err.response?.data?.message || "Invalid OTP");
            } finally {
                setIsLoading(false);
            }
            return;
        }

        if (!email || !password || (isRegister && !name)) {
            toast.error("Please fill all required fields");
            return;
        }

        setIsLoading(true);

        try {
            if (isRegister) {
                await http.post("/users/signup", {
                    name,
                    email,
                    password,
                });

                toast.success("OTP sent to your email!");
                setIsOtpMode(true);
            } else {
                const res = await http.post("/users/login", {
                    email,
                    password,
                });

                storeToken(res.data.token)

                localStorage.setItem("token", res.data.token);
                toast.success("Logged in!");

                navigate("/");
            }
        } catch (err: any) {
            if (!isRegister && err.response?.status === 401 && err.response?.data?.message?.toLowerCase().includes("verify")) {
                toast.error("Account not verified. OTP sent!");
                setIsOtpMode(true);
            } else {
                toast.error(err.response?.data?.message || "Something went wrong");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='__login_page'>
            <div className='container'>
                <div className='register'>

                    <section className='right_section'>
                        <div className='login_component'>

                            <div className='login-content'>
                                <h2>
                                    {isOtpMode ? "Verify your email" : isRegister ? "Create your account" : "Log in to your account"}
                                </h2>
                                <p>
                                    {isOtpMode ? `Enter the 6-digit code sent to ${email}` : isRegister ? "Start your journey 🚀" : "Glad you're back!"}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit}>

                                {isOtpMode ? (
                                    <div className='input-field'>
                                        <input
                                            type='text'
                                            placeholder='6-digit OTP'
                                            value={otp}
                                            maxLength={6}
                                            onChange={(e) => setOtp(e.target.value)}
                                        />
                                    </div>
                                ) : (
                                    <>
                                        {/* ✅ Name only for register */}
                                        {isRegister && (
                                            <div className='input-field'>
                                                <input
                                                    type='text'
                                                    placeholder='Name'
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                />
                                            </div>
                                        )}

                                        <div className='input-field'>
                                            <input
                                                type='email'
                                                placeholder='Email'
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>

                                        <div className='input-field'>
                                            <input
                                                type='password'
                                                placeholder='Password'
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </div>
                                    </>
                                )}

                                <button className='btn' type='submit' disabled={isLoading}>
                                    {isLoading
                                        ? "Loading..."
                                        : isOtpMode
                                            ? "Verify OTP"
                                            : isRegister
                                                ? "Create Account"
                                                : "Login"}
                                </button>

                            </form>


                            {isOtpMode ? (
                                <p style={{ marginTop: "10px", fontSize: "14px" }} className="__bottom_text" >
                                    Didn't receive the code?{" "}
                                    <span
                                        onClick={handleResendOtp}
                                        style={{ cursor: "pointer", textDecoration: "underline" }}
                                    >
                                        Resend OTP
                                    </span>
                                    <br />
                                    <span
                                        onClick={() => setIsOtpMode(false)}
                                        style={{ cursor: "pointer", textDecoration: "underline", display: 'block', marginTop: '5px' }}
                                    >
                                        Back to {isRegister ? "Signup" : "Login"}
                                    </span>
                                </p>
                            ) : (
                                <p style={{ marginTop: "10px", fontSize: "14px" }} className="__bottom_text" >
                                    {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
                                    <span
                                        onClick={() => setIsRegister(!isRegister)}
                                        style={{ cursor: "pointer", textDecoration: "underline" }}
                                    >
                                        {isRegister ? "Login" : "Create one"}
                                    </span>
                                </p>
                            )}

                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default Login;