import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import createRoom from "../controllers/createRoom.js";
import getRoomHistory from "../controllers/getRoomHistory.js";
import joinRoom from "../controllers/joinRoom.js";
import sendMessage from "../controllers/sendMessage.js";

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    createRoom
);

router.get(
    "/:roomId",
    authMiddleware,
    joinRoom
);

router.post(
    "/:roomId/items",
    authMiddleware,
    sendMessage
);

router.get(
    "/:roomId/items",
    authMiddleware,
    getRoomHistory
);

export default router;