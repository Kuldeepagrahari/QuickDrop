import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    Check,
    ChevronDown,
    Clipboard,
    Copy,
    Link as LinkIcon,
    MoreHorizontal,
    Send,
    ShieldCheck,
    Trash2,
    Users,
    Code2,
    FileText
} from "lucide-react";

import { useAuth } from "../context/AuthContext.jsx";
import {
    clearRoom,
    getItems,
    getRoom,
    sendItem
} from "../services/api.js";
import "./Room.css"

const tabs = [
    { id: "text", label: "Text", icon: FileText },
    { id: "link", label: "Link", icon: LinkIcon },
    { id: "code", label: "Code", icon: Code2 }
];

const formatTime = (dateValue) => {
    if (!dateValue) return "Just now";

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return "Just now";

    const diff = Date.now() - date.getTime();

    if (diff < 60 * 1000) return "Just now";
    if (diff < 60 * 60 * 1000) {
        return `${Math.floor(diff / (60 * 1000))}m ago`;
    }
    if (diff < 24 * 60 * 60 * 1000) {
        return `${Math.floor(diff / (60 * 60 * 1000))}h ago`;
    }

    return date.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short"
    });
};

const isProbablyUrl = (value) => {
    try {
        const url = new URL(value.trim());
        return ["http:", "https:"].includes(url.protocol);
    } catch {
        return false;
    }
};

const Room = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [room, setRoom] = useState(null);
    const [items, setItems] = useState([]);
    const [content, setContent] = useState("");
    const [activeTab, setActiveTab] = useState("text");

    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [clearing, setClearing] = useState(false);

    const [error, setError] = useState("");
    const [copied, setCopied] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);

    const isOwner = useMemo(
        () => Boolean(room?.ownerId && user?.uid && room.ownerId === user.uid),
        [room, user]
    );

    useEffect(() => {
        const loadRoom = async () => {
            try {
                setLoading(true);
                setError("");

                const [roomData, itemData] = await Promise.all([
                    getRoom(roomId),
                    getItems(roomId)
                ]);

                setRoom(roomData);
                setItems(itemData);
            } catch (err) {
                setError(err.message || "Could not load this room");
            } finally {
                setLoading(false);
            }
        };

        loadRoom();
    }, [roomId]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
                event.preventDefault();

                if (content.trim() && !sending) {
                    document.getElementById("quickdrop-send-form")?.requestSubmit();
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [content, sending]);

    const handleSend = async (event) => {
        event.preventDefault();

        if (!content.trim() || sending) return;

        try {
            setSending(true);
            setError("");

            const item = await sendItem(roomId, content);

            setItems((current) => [item, ...current]);
            setContent("");
        } catch (err) {
            setError(err.message || "Could not send item");
        } finally {
            setSending(false);
        }
    };

    const handleClear = async () => {
        if (!isOwner || clearing) return;

        const confirmed = window.confirm(
            "Clear all shared items from this room?"
        );

        if (!confirmed) return;

        try {
            setClearing(true);
            setError("");

            await clearRoom(roomId);
            setItems([]);
            setMenuOpen(false);
        } catch (err) {
            setError(err.message || "Could not clear room");
        } finally {
            setClearing(false);
        }
    };

    const handleCopy = async (value, key) => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(key);

            window.setTimeout(() => {
                setCopied("");
            }, 1500);
        } catch {
            setError("Could not copy to clipboard");
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);

        if (tab === "link") {
            setContent((current) => current);
        }
    };

    const placeholder = {
        text: "Paste text, notes, commands, or anything you want to share...",
        link: "Paste a URL to share it with everyone in the room...",
        code: "Paste code, configuration, SQL, JSON, or commands..."
    }[activeTab];

    if (loading) {
        return (
            <div className="center-page">
                <div className="page-loader">
                    <div className="loader" />
                    <p>Opening your room...</p>
                </div>
            </div>
        );
    }

    if (error && !room) {
        return (
            <div className="center-page">
                <div className="room-error-card">
                    <div className="room-error-icon">!</div>
                    <h2>Room unavailable</h2>
                    <p>{error}</p>
                    <button
                        className="room-back-action"
                        onClick={() => navigate("/")}
                    >
                        <ArrowLeft size={16} />
                        Back to QuickDrop
                    </button>
                </div>
            </div>
        );
    }

    return (
        <main className="page room-page room-page-redesign">
            <div className="room-breadcrumb">
                <button
                    className="room-back-link"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={15} />
                    Back
                </button>

                <span className="breadcrumb-separator">/</span>
                <span>Room</span>
            </div>

            <motion.section
                className="room-hero-card"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
            >
                <div>
                    <div className="room-eyebrow">
                        <span className="room-live-dot" />
                        Private room
                    </div>

                    <div className="room-heading-row">
                        <h1>{room?.roomId || roomId}</h1>

                        <button
                            className="room-code-copy"
                            onClick={() =>
                                handleCopy(room?.roomId || roomId, "room")
                            }
                            title="Copy room code"
                        >
                            {copied === "room" ? (
                                <Check size={15} />
                            ) : (
                                <Copy size={15} />
                            )}
                            {copied === "room" ? "Copied" : "Copy code"}
                        </button>
                    </div>

                    <p className="room-subtitle">
                        Share text, links and code instantly with everyone in
                        this room.
                    </p>
                </div>

                <div className="room-meta">
                    <div className="connection-pill">
                        <span className="room-live-dot" />
                        Live connection
                    </div>

                    {isOwner && (
                        <div className="owner-pill">
                            <ShieldCheck size={14} />
                            Owner
                        </div>
                    )}

                    <div className="room-menu-wrap">
                        <button
                            className="room-icon-button"
                            onClick={() => setMenuOpen((value) => !value)}
                            aria-label="Room actions"
                        >
                            <MoreHorizontal size={18} />
                        </button>

                        <AnimatePresence>
                            {menuOpen && (
                                <motion.div
                                    className="room-menu"
                                    initial={{ opacity: 0, y: -5, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -5, scale: 0.98 }}
                                >
                                    <button
                                        onClick={() =>
                                            handleCopy(
                                                room?.roomId || roomId,
                                                "room"
                                            )
                                        }
                                    >
                                        <Copy size={15} />
                                        Copy room code
                                    </button>

                                    {isOwner && (
                                        <button
                                            className="danger-menu-item"
                                            onClick={handleClear}
                                            disabled={clearing}
                                        >
                                            <Trash2 size={15} />
                                            {clearing
                                                ? "Clearing..."
                                                : "Clear shared items"}
                                        </button>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.section>

            <AnimatePresence>
                {error && (
                    <motion.div
                        className="room-inline-error"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.section
                className="share-composer"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
            >
                <div className="composer-top">
                    <div>
                        <span className="composer-label">Share something</span>
                        <p>Drop it here and send it to the room.</p>
                    </div>

                    <div className="composer-shortcut">
                        <span>⌘</span>
                        <span>Enter</span>
                    </div>
                </div>

                <div className="composer-tabs">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const active = activeTab === tab.id;

                        return (
                            <button
                                key={tab.id}
                                className={`composer-tab ${
                                    active ? "active" : ""
                                }`}
                                onClick={() => handleTabChange(tab.id)}
                                type="button"
                            >
                                <Icon size={15} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                <form
                    id="quickdrop-send-form"
                    className={`composer-input-wrap composer-${activeTab}`}
                    onSubmit={handleSend}
                >
                    <textarea
                        className="composer-textarea"
                        value={content}
                        onChange={(event) => setContent(event.target.value)}
                        placeholder={placeholder}
                        spellCheck={activeTab !== "code"}
                        autoComplete="off"
                    />

                    <div className="composer-footer">
                        <div className="composer-info">
                            <span>{content.length.toLocaleString()} characters</span>

                            {activeTab === "link" && content.trim() && (
                                <span
                                    className={
                                        isProbablyUrl(content)
                                            ? "input-valid"
                                            : "input-warning"
                                    }
                                >
                                    {isProbablyUrl(content)
                                        ? "Valid URL"
                                        : "Enter a valid URL"}
                                </span>
                            )}
                        </div>

                        <button
                            className="send-button"
                            type="submit"
                            disabled={!content.trim() || sending}
                        >
                            <Send size={16} />
                            {sending ? "Sending..." : "Send"}
                        </button>
                    </div>
                </form>
            </motion.section>

            <section className="shared-section">
                <div className="shared-section-header">
                    <div>
                        <div className="shared-title-row">
                            <h2>Shared items</h2>
                            <span className="item-count-badge">
                                {items.length}
                            </span>
                        </div>
                        <p>Everything shared in this room appears here.</p>
                    </div>

                    <div className="shared-online">
                        <Users size={15} />
                        <span>Live</span>
                    </div>
                </div>

                {items.length === 0 ? (
                    <motion.div
                        className="premium-empty-state"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="empty-orbit">
                            <Clipboard size={24} />
                        </div>

                        <h3>Your room is ready</h3>
                        <p>
                            Paste text, links, or code above to share it
                            instantly with everyone in this room.
                        </p>
                    </motion.div>
                ) : (
                    <div className="premium-items-list">
                        <AnimatePresence initial={false}>
                            {items.map((item, index) => (
                                <motion.article
                                    className="premium-item-card"
                                    key={item._id || `${item.createdAt}-${index}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.25,
                                        delay: Math.min(index * 0.025, 0.2)
                                    }}
                                >
                                    <div className="item-card-top">
                                        <div className="sender-info">
                                            <div className="sender-avatar">
                                                {(user?.displayName ||
                                                    user?.email ||
                                                    "U")
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>

                                            <div>
                                                <strong>
                                                    {user?.displayName ||
                                                        user?.email?.split(
                                                            "@"
                                                        )[0] ||
                                                        "You"}
                                                </strong>
                                                <span>
                                                    {formatTime(
                                                        item.createdAt
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="item-actions">
                                            <span className="item-type-badge">
                                                {item.type === "text"
                                                    ? "TEXT"
                                                    : item.type?.toUpperCase()}
                                            </span>

                                            <button
                                                className="item-copy-button"
                                                onClick={() =>
                                                    handleCopy(
                                                        item.content,
                                                        item._id || index
                                                    )
                                                }
                                                title="Copy item"
                                            >
                                                {copied ===
                                                (item._id || index) ? (
                                                    <Check size={15} />
                                                ) : (
                                                    <Copy size={15} />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div
                                        className={`premium-item-content ${
                                            activeTab === "code"
                                                ? "looks-like-code"
                                                : ""
                                        }`}
                                    >
                                        {isProbablyUrl(item.content) ? (
                                            <a
                                                href={item.content}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="shared-link"
                                            >
                                                {item.content}
                                            </a>
                                        ) : (
                                            item.content
                                        )}
                                    </div>
                                </motion.article>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </section>
        </main>
    );
};

export default Room;
