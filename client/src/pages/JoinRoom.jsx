import { useState } from "react";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Button from "../components/Button.jsx";
import { getRoom } from "../services/api.js";

const JoinRoom = () => {
    const navigate = useNavigate();

    const [roomId, setRoomId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleJoinRoom = async (event) => {
        event.preventDefault();

        const code = roomId.trim().toUpperCase();

        if (!code) {
            setError("Enter a room code");
            return;
        }

        try {
            setLoading(true);
            setError("");

            await getRoom(code);

            navigate(`/room/${code}`);
        } catch (error) {
            console.error(error);
            setError(error.message || "Room not found");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="center-page">
            <motion.div
                className="room-card"
                initial={{
                    opacity: 0,
                    y: 25
                }}
                animate={{
                    opacity: 1,
                    y: 0
                }}
            >
                <div className="page-icon">
                    <LogIn size={24} />
                </div>

                <h1>Join a Room</h1>

                <p>
                    Enter the room code shared with you.
                </p>

                <form onSubmit={handleJoinRoom}>
                    <input
                        type="text"
                        value={roomId}
                        onChange={(event) =>
                            setRoomId(event.target.value)
                        }
                        placeholder="e.g. A7F29C"
                        maxLength={6}
                        className="room-input"
                    />

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Joining..."
                            : "Join Room"}
                    </Button>
                </form>
            </motion.div>
        </main>
    );
};

export default JoinRoom;