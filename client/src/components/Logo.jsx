import { Zap } from "lucide-react";
import { motion } from "framer-motion";
import "./Logo.css";

function Logo() {
    return (
        <motion.div
            className="logo"
            whileHover={{ scale: 1.03 }}
        >
            <div className="logo-icon">
                <Zap size={20} />
            </div>

            <span>QuickDrop</span>
        </motion.div>
    );
}

export default Logo;