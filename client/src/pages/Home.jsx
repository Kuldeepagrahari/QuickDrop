import { motion } from "framer-motion";
import {
    ArrowRight,
    Clipboard,
    Clock3,
    Lock,
    Zap
} from "lucide-react";
import { Link } from "react-router-dom";

import Button from "../components/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const features = [
    {
        icon: Zap,
        title: "Instant Sharing",
        description: "Share text and links between your devices in real time."
    },
    {
        icon: Clipboard,
        title: "One Simple Room",
        description: "Create a room and share the room code with anyone."
    },
    {
        icon: Clock3,
        title: "Temporary Data",
        description: "Shared content is designed to expire automatically."
    },
    {
        icon: Lock,
        title: "Private Rooms",
        description: "Your shared content stays inside your room."
    }
];

const Home = () => {
    const { user } = useAuth();

    return (
        <main className="home-page">
            <section className="hero-section">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="hero-content"
                >
                    <div className="hero-badge">
                        <Zap size={15} />
                        Real-time sharing
                    </div>

                    <h1>
                        Share anything.
                        <br />
                        <span>Instantly.</span>
                    </h1>

                    <p>
                        QuickDrop lets you share text, links, code and files
                        between devices using a simple room.
                    </p>

                    <div className="hero-actions">
                        {user ? (
                            <>
                                <Link to="/create-room">
                                    <Button>
                                        Create Room
                                        <ArrowRight size={18} />
                                    </Button>
                                </Link>

                                <Link to="/join-room">
                                    <Button variant="secondary">
                                        Join Room
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <Link to="/login">
                                <Button>
                                    Get Started
                                    <ArrowRight size={18} />
                                </Button>
                            </Link>
                        )}
                    </div>
                </motion.div>
            </section>

            <section className="features-section">
                {features.map((feature, index) => {
                    const Icon = feature.icon;

                    return (
                        <motion.div
                            key={feature.title}
                            initial={{
                                opacity: 0,
                                y: 25
                            }}
                            animate={{
                                opacity: 1,
                                y: 0
                            }}
                            transition={{
                                delay: index * 0.1,
                                duration: 0.5
                            }}
                            className="feature-card"
                        >
                            <div className="feature-icon">
                                <Icon size={21} />
                            </div>

                            <h3>{feature.title}</h3>

                            <p>{feature.description}</p>
                        </motion.div>
                    );
                })}
            </section>
        </main>
    );
};

export default Home;