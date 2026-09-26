import { motion } from "framer-motion";
import "./AnimatedBackground.css";

function AnimatedBackground() {
    return (
        <div className="background">
            <motion.div
                className="orb orb-one"
                animate={{
                    x: [0, 100, -50, 0],
                    y: [0, -80, 40, 0],
                    scale: [1, 1.15, 0.9, 1]
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            <motion.div
                className="orb orb-two"
                animate={{
                    x: [0, -100, 50, 0],
                    y: [0, 60, -50, 0],
                    scale: [1, 0.9, 1.2, 1]
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            <div className="grid-overlay" />
        </div>
    );
}

export default AnimatedBackground;