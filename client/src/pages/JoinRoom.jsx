import {useState, useMemo, useEffect} from "react"
import { motion } from "framer-motion";
import {
    ArrowRight,
    CalendarDays,
    Check,
    Clock3,
    Copy,
    DoorOpen,
    History,
    Plus,
    Search,
    Share2,
    Trash2
} from "lucide-react";

import "./JoinRoom.css"

import {
    getCreatedRooms,
    deleteRoom
} from "../services/api.js";


const formatDate = (value) => {
    if (!value) return "Recently";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Recently";

    return date.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
};
import { useNavigate } from "react-router-dom";

const JoinRoom = () => {
    const navigate = useNavigate();

    const [roomId, setRoomId] = useState("");
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState("");

    useEffect(() => {
        const loadRooms = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getCreatedRooms();
                setRooms(Array.isArray(data) ? data : []);
            } catch (err) {
                setError(err.message || "Could not load your previous rooms");
            } finally {
                setLoading(false);
            }
        };

        loadRooms();
    }, []);

    const normalizedInput = roomId.trim().toUpperCase();

    const filteredRooms = useMemo(() => {
        if (!normalizedInput) return rooms;

        return rooms.filter((room) =>
            room.roomId?.toUpperCase().includes(normalizedInput)
        );
    }, [rooms, normalizedInput]);

    const handleJoin = async (event) => {
        event.preventDefault();

        if (!normalizedInput) {
            setError("Enter a room code");
            return;
        }

        try {
            setJoining(true);
            setError("");
            navigate(`/room/${normalizedInput}`);
        } catch (err) {
            setError(err.message || "Could not join room");
            setJoining(false);
        }
    };

    const handleCopy = async (id) => {
        try {
            await navigator.clipboard.writeText(id);
            setCopied(id);

            window.setTimeout(() => {
                setCopied("");
            }, 1500);
        } catch {
            setError("Could not copy room code");
        }
    };

    const handleDelete = async (event, room) => {
        event.stopPropagation();
    
        const confirmed = window.confirm(
            `Delete "${room.name || `Room ${room.roomId}`}"?\n\nAll shared items in this room will also be deleted.`
        );
    
        if (!confirmed) return;
    
        try {
            setError("");
    
            await deleteRoom(room.roomId);
    
            setRooms((currentRooms) =>
                currentRooms.filter(
                    (currentRoom) =>
                        currentRoom.roomId !== room.roomId
                )
            );
        } catch (err) {
            setError(
                err.message ||
                "Could not delete room"
            );
        }
    };

    return (
        <main className="page join-page-redesign">
            <motion.section
                className="join-hero"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="join-icon">
                    <DoorOpen size={23} />
                </div>

                <div className="join-eyebrow">
                    <span />
                    QUICKDROP ROOMS
                </div>

                <h1>Join a room</h1>
                <p>
                    Enter a room code or reopen one you've used before.
                    Everything is already waiting for you.
                </p>
            </motion.section>

            <motion.form
                className="join-form-redesign"
                onSubmit={handleJoin}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
            >
                <div className="join-input-wrap">
                    <Search size={17} />
                    <input
                        value={roomId}
                        onChange={(event) =>
                            setRoomId(event.target.value.toUpperCase())
                        }
                        placeholder="Enter room code"
                        maxLength={6}
                        autoComplete="off"
                        spellCheck="false"
                    />
                    {roomId && (
                        <button
                            type="button"
                            className="join-clear-input"
                            onClick={() => setRoomId("")}
                        >
                            ×
                        </button>
                    )}
                </div>

                <button
                    className="join-submit-button"
                    type="submit"
                    disabled={!normalizedInput || joining}
                >
                    {joining ? "Opening..." : "Join room"}
                    <ArrowRight size={16} />
                </button>
            </motion.form>

            {error && <div className="join-error">{error}</div>}

            <section className="previous-rooms-section">
                <div className="previous-rooms-header">
                    <div>
                        <div className="previous-title">
                            <History size={17} />
                            <h2>Your rooms</h2>
                            <span>{rooms.length}</span>
                        </div>
                        <p>Rooms you've created with this account.</p>
                    </div>
                </div>

                {loading ? (
                    <div className="rooms-loading">
                        <div className="loader" />
                        <span>Loading your rooms...</span>
                    </div>
                ) : filteredRooms.length === 0 ? (
                    <div className="no-rooms-card">
                        <div className="no-rooms-icon">
                            <DoorOpen size={21} />
                        </div>

                        <h3>
                            {rooms.length === 0
                                ? "No rooms yet"
                                : "No matching rooms"}
                        </h3>

                        <p>
                            {rooms.length === 0
                                ? "Create a room once and it will appear here for quick access."
                                : "Try a different room code."}
                        </p>
                    </div>
                ) : (
                    <div className="previous-rooms-list">
                        {filteredRooms.map((room, index) => (
                            <motion.article
                                className="previous-room-card"
                                key={room.roomId}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: Math.min(index * 0.035, 0.2)
                                }}
                                onClick={() =>
                                    navigate(`/room/${room.roomId}`)
                                }
                            >
                                <div className="previous-room-main">
                                    <div className="previous-room-code">
                                        {room.roomId}
                                    </div>

                                    <div className="previous-room-info">
                                        <strong>
                                            {room.name || `Room ${room.roomId}`}
                                        </strong>

                                        <span>
                                            <Clock3 size={12} />
                                            Created {formatDate(room.createdAt)}
                                        </span>
                                    </div>
                                </div>

                                <div className="previous-room-actions">
                                    <div className="previous-room-members" title="Shared items">
                                        <span>{room.itemCount ?? 0}</span>
                                        <span>items</span>
                                    </div>

                                    <button
                                        className="room-copy-button"
                                        type="button"
                                        title="Copy room code"
                                        aria-label="Copy room code"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            handleCopy(room.roomId);
                                        }}
                                    >
                                        {copied === room.roomId ? (
                                            <Check size={14} />
                                        ) : (
                                            <Copy size={14} />
                                        )}
                                    </button>

                                    <button
                                        className="room-copy-button"
                                        type="button"
                                        title="Delete room"
                                        aria-label="Delete room"
                                        onClick={(event) =>
                                            handleDelete(event, room)
                                        }
                                    >
                                        <Trash2 size={14} />
                                    </button>

                                    <ArrowRight
                                        className="room-open-arrow"
                                        size={16}
                                    />
                                </div>
                            </motion.article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
};

export default JoinRoom;
