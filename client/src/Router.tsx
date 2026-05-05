import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Conversation from "./pages/Conversation";

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/c" element={<Navigate to="/" replace />} />
                <Route path="/c/:id" element={<Conversation />} />
            </Routes>
        </BrowserRouter>
    );
};

export default Router