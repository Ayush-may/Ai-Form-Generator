import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Conversation from "./pages/Conversation";
import { useAuth } from "./providers/AuthProvider";
import FormsPage from "./pages/FormsPage";
import LiveForm from "./pages/LiveForm";
import SubmissionsPage from "./pages/SubmissionsPage";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const { token } = useAuth();

    if (token === undefined) {
        return <p>Loading...</p>;
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

const Router = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/c" element={<Navigate to="/" replace />} />
            <Route path="/f/:slug" element={<LiveForm />} />

            {/* Private Routes */}
            <Route path="/" element={
                <PrivateRoute>
                    <Home />
                </PrivateRoute>
            } />
            <Route
                path="/c/:id"
                element={
                    <PrivateRoute>
                        <Conversation />
                    </PrivateRoute>
                }
            />
            <Route
                path="/forms"
                element={
                    <PrivateRoute>
                        <FormsPage />
                    </PrivateRoute>
                }
            />
            <Route
                path="/submissions"
                element={
                    <PrivateRoute>
                        <SubmissionsPage />
                    </PrivateRoute>
                }
            />
        </Routes>
    );
};

export default Router;