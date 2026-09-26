import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Copy, Send } from "lucide-react";
import { useParams } from "react-router-dom";

import Button from "../components/Button.jsx";
import {
    getItems,
    getRoom,
    sendItem
} from "../services/api.js";

const Room = () => {
    const { roomId } = useParams();

    const [items, setItems] = useState([]);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadRoom = async () => {
            try {
                setLoading(true);

                await getRoom(roomId);

                const data = await getItems(roomId);

                setItems(data);
            } catch (error) {
                console.error(error);
                setError(
                    error.message || "Could not load room"
                );
            } finally {
                setLoading(false);
            }
        };

        loadRoom();
    }, [roomId]);

    const handleSend = async () => {
        if (!content.trim()) {
            return;
        }

        try {
            setSending(true);
            setError("");

            const item = await sendItem(
                roomId,
                content
            );

            setItems((previousItems) => [
                item,
                ...previousItems
            ]);

            setContent("");
        } catch (error) {
            console.error(error);

            setError(
                error.message || "Could not send message"
            );
        } finally {
            setSending(false);
        }
    };

    const copyItem = async (text) => {
        await navigator.clipboard.writeText(text);
    };

    if (loading) {
        return (
            <main className="center-page">
                <div className="page-loader">
                    <div className="loader"></div>
                    <p>Loading room...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="room-page">
            <motion.div
                className="room-header"
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div>
                    <span className="room-label">
                        ROOM
                    </span>

                    <h1>{roomId}</h1>
                </div>

                <div className="room-status">
                    <span className="status-dot"></span>
                    Connected
                </div>
            </motion.div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <section className="share-box">
                <textarea
                    value={content}
                    onChange={(event) =>
                        setContent(event.target.value)
                    }
                    placeholder="Paste text, links or code..."
                    rows={5}
                />

                <div className="share-actions">
                    <span>
                        {content.length} characters
                    </span>

                    <Button
                        onClick={handleSend}
                        disabled={
                            sending || !content.trim()
                        }
                    >
                        <Send size={17} />

                        {sending
                            ? "Sending..."
                            : "Send"}
                    </Button>
                </div>
            </section>

            <section className="items-section">
                <div className="section-heading">
                    <h2>Shared Items</h2>

                    <span>
                        {items.length} items
                    </span>
                </div>

                {items.length === 0 ? (
                    <div className="empty-state">
                        <p>No items shared yet.</p>
                        <span>
                            Send something to see it here.
                        </span>
                    </div>
                ) : (
                    <div className="items-list">
                        {items.map((item) => (
                            <motion.div
                                key={item._id}
                                className="item-card"
                                initial={{
                                    opacity: 0,
                                    y: 10
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0
                                }}
                            >
                                <div className="item-content">
                                    {item.content}
                                </div>

                                <button
                                    className="icon-button"
                                    onClick={() =>
                                        copyItem(
                                            item.content
                                        )
                                    }
                                    title="Copy"
                                >
                                    <Copy size={17} />
                                </button>

                                <div className="item-time">
                                    {new Date(
                                        item.createdAt
                                    ).toLocaleString()}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
};

export default Room;