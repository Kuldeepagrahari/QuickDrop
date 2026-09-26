import { useState } from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Button from "../components/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
    const { loginWithGoogle } = useAuth();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleGoogleLogin = async () => {
        try {
            setError("");
            setLoading(true);

            await loginWithGoogle();

            navigate("/");
        } catch (error) {
            console.error(error);

            setError(
                error.message || "Google login failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-page">
            <motion.div
                className="auth-card"
                initial={{
                    opacity: 0,
                    scale: 0.95,
                    y: 20
                }}
                animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0
                }}
                transition={{ duration: 0.5 }}
            >
                <div className="auth-icon">
                    <Mail size={25} />
                </div>

                <h1>Welcome to QuickDrop</h1>

                <p>
                    Sign in to create rooms and share content
                    across your devices.
                </p>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <Button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="google-button"
                >
                    <Mail size={19} />

                    {loading
                        ? "Signing in..."
                        : "Continue with Google"}
                </Button>

                <div className="login-divider">
                    <span>or</span>
                </div>

                <Button
                    variant="secondary"
                    disabled
                    className="email-button"
                >
                    <Mail size={19} />
                    Continue with Email OTP
                </Button>

                <small className="auth-note">
                    Email OTP will be enabled after the email
                    verification service is configured.
                </small>
            </motion.div>
        </main>
    );
};

export default Login;