import { Link, useNavigate } from "react-router-dom";
import { LogOut, Zap } from "lucide-react";

import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-logo">
                <div className="logo-icon">
                    <Zap size={18} />
                </div>

                <span>QuickDrop</span>
            </Link>

            <div className="navbar-links">
                {user ? (
                    <>
                        <Link to="/create-room">Create Room</Link>
                        <Link to="/join-room">Join Room</Link>

                        <div className="user-section">
                            {user.photoURL && (
                                <img
                                    src={user.photoURL}
                                    alt={user.displayName || "User"}
                                    className="user-avatar"
                                />
                            )}

                            <span className="user-name">
                                {user.displayName || "User"}
                            </span>

                            <button
                                className="logout-button"
                                onClick={handleLogout}
                                title="Logout"
                            >
                                <LogOut size={17} />
                            </button>
                        </div>
                    </>
                ) : (
                    <Link to="/login">Login</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;