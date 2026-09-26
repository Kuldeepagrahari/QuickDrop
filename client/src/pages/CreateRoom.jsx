import { useState } from "react";
import { motion } from "framer-motion";
import {
    Check,
    Copy,
    Plus
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Button from "../components/Button.jsx";
import { createRoom } from "../services/api.js";
import "./CreateRoom.css";

const CreateRoom = () => {
    const navigate = useNavigate();

    const [roomName, setRoomName] = useState("");
    const [roomId, setRoomId] = useState("");
    const [createdName, setCreatedName] = useState("");

    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState("");

    const handleCreateRoom = async () => {
        const name = roomName.trim();

        if (!name) {
            setError("Enter a room name");
            return;
        }

        if (name.length > 50) {
            setError(
                "Room name must be 50 characters or less"
            );
            return;
        }

        try {
            setLoading(true);
            setError("");

            const data = await createRoom(name);

            setRoomId(data.roomId);
            setCreatedName(
                data.name || name
            );
        } catch (error) {
            console.error(error);

            setError(
                error.message ||
                "Could not create room"
            );
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
                    Create a private room and
                    give it a name.
                </p>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {!roomId ? (
                    <>
                        <input
                            className="room-name-input"
                            type="text"
                            value={roomName}
                            onChange={(event) =>
                                setRoomName(
                                    event.target.value
                                )
                            }
                            placeholder="Enter room name"
                            maxLength={50}
                            autoComplete="off"
                        />

                        <Button
                            onClick={
                                handleCreateRoom
                            }
                            disabled={loading}
                        >
                            {loading
                                ? "Creating..."
                                : "Create Room"}
                        </Button>
                    </>
                ) : (
                    <>
                        <div className="created-room-name">
                            {createdName}
                        </div>

                        <div className="room-code-box">
                            <span>{roomId}</span>

                            <button
                                onClick={copyRoomId}
                                className="icon-button"
                                type="button"
                                aria-label="Copy room code"
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
                                navigate(
                                    `/room/${roomId}`
                                )
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