import { adminAuth } from "../config/firebaseAdmin.js";
import User from "../models/users.js";

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "Authorization token is required"
            });
        }

        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Invalid authorization format"
            });
        }

        const token = authHeader.split("Bearer ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Authentication token is missing"
            });
        }

        const decodedToken =
            await adminAuth.verifyIdToken(token);

        let user = await User.findOne({
            firebaseUid: decodedToken.uid
        });

        if (!user) {
            user = await User.create({
                firebaseUid: decodedToken.uid,
                email: decodedToken.email,
                name:
                    decodedToken.name ||
                    decodedToken.email?.split("@")[0] ||
                    "User",
                picture: decodedToken.picture || ""
            });
        }

        req.user = user;
        req.firebaseUser = decodedToken;

        next();
    } catch (error) {
        console.error("Authentication failed:", error);

        return res.status(401).json({
            message: "Invalid or expired authentication token"
        });
    }
};

export default authMiddleware;