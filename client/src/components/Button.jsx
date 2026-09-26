import { motion } from "framer-motion";

const Button = ({
    children,
    onClick,
    type = "button",
    variant = "primary",
    disabled = false,
    className = ""
}) => {
    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled}
            whileHover={!disabled ? { scale: 1.02 } : {}}
            whileTap={!disabled ? { scale: 0.97 } : {}}
            className={`btn btn-${variant} ${className}`}
        >
            {children}
        </motion.button>
    );
};

export default Button;