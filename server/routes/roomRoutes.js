import express from "express";
import getRoomHistory from "../controllers/getRoomHistory.js";
import sendMessage from "../controllers/sendMessage.js";
import joinRoom from "../controllers/joinRoom.js";
import createRoom from "../controllers/createRoom.js";

const router = express.Router();


// CREATE ROOM
router.post("/", createRoom);

// JOIN / CHECK ROOM
router.get("/:roomId", joinRoom);

// SEND TEXT
router.post("/:roomId/items", sendMessage);

// GET ROOM HISTORY
router.get("/:roomId/items", getRoomHistory);


export default router;