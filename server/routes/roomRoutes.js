import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import createRoom from "../controllers/createRoom.js";
import getRoomHistory from "../controllers/getRoomHistory.js";
import joinRoom from "../controllers/joinRoom.js";
import sendMessage from "../controllers/sendMessage.js";
import clearRoom from "../controllers/clearRoom.js";
import getCreatedRooms from "../controllers/getCreatedRooms.js";

const router = express.Router();

// CREATE ROOM
router.post(
    "/",
    authMiddleware,
    createRoom
);

// JOIN / CHECK ROOM
router.get(
    "/:roomId",
    authMiddleware,
    joinRoom
);

// SEND TEXT
router.post(
    "/:roomId/items",
    authMiddleware,
    sendMessage
);

// GET ROOM HISTORY
router.get(
    "/:roomId/items",
    authMiddleware,
    getRoomHistory
);

// CLEAR ROOM - OWNER ONLY
router.delete(
    "/:roomId/items",
    authMiddleware,
    clearRoom
);

router.get("/created", authMiddleware, getCreatedRooms);

export default router;