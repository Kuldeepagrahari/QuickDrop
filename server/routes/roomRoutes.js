import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import createRoom from "../controllers/createRoom.js";
import getCreatedRooms from "../controllers/getCreatedRooms.js";
import joinRoom from "../controllers/joinRoom.js";
import getRoomHistory from "../controllers/getRoomHistory.js";
import sendMessage from "../controllers/sendMessage.js";
import clearRoom from "../controllers/clearRoom.js";
import deleteRoom from "../controllers/deleteRoom.js";

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    createRoom
);

// Keep this route BEFORE /:roomId.
router.get(
    "/created",
    authMiddleware,
    getCreatedRooms
);

router.get(
    "/:roomId",
    authMiddleware,
    joinRoom
);

router.delete(
    "/:roomId",
    authMiddleware,
    deleteRoom
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

router.delete(
    "/:roomId/items",
    authMiddleware,
    clearRoom
);

export default router;
