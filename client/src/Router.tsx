import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Conversation from "./pages/Conversation";
import AiChatProvider from "./providers/AiChatProvider";
import AuthProvider from "./providers/AuthProvider";
import FormsPage from "./pages/FormsPage";

const Router = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AiChatProvider>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/c" element={<Navigate to="/" replace />} />
                        <Route path="/c/:id" element={<Conversation />} />
                        <Route path="/forms" element={<FormsPage />} />
                    </Routes>
                </AiChatProvider>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default Router;