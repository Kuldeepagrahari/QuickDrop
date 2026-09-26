import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Button from "../components/Button.jsx";
import { createRoom } from "../services/api.js";

const CreateRoom = () => {
    const navigate = useNavigate();

    const [roomId, setRoomId] = useState("");
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState("");

    const handleCreateRoom = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await createRoom();

            setRoomId(data.roomId);
        } catch (error) {
            console.error(error);
            setError(error.message || "Could not create room");
        } finally {
            setLoading(false);
        }
    };

    const copyRoomId = async () => {
        await navigator.clipboard.writeText(roomId);

        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 1500);
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
                    <Plus size={24} />
                </div>

                <h1>Create a Room</h1>

                <p>
                    Create a private room and share its code
                    with another device.
                </p>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {!roomId ? (
                    <Button
                        onClick={handleCreateRoom}
                        disabled={loading}
                    >
                        {loading
                            ? "Creating..."
                            : "Create Room"}
                    </Button>
                ) : (
                    <>
                        <div className="room-code-box">
                            <span>{roomId}</span>

                            <button
                                onClick={copyRoomId}
                                className="icon-button"
                            >
                                {copied ? (
                                    <Check size={19} />
                                ) : (
                                    <Copy size={19} />
                                )}
                            </button>
                        </div>

                        <Button
                            onClick={() =>
                                navigate(`/room/${roomId}`)
                            }
                        >
                            Open Room
                        </Button>
                    </>
                )}
            </motion.div>
        </main>
    );
};

export default CreateRoom;