import crypto from "crypto";
import Room from "../models/rooms.js";

const createRoom = async (req, res) => {
    try {
        const requestedName =
            typeof req.body?.name === "string"
                ? req.body.name.trim()
                : "";

        const roomId = crypto
            .randomBytes(3)
            .toString("hex")
            .toUpperCase();

        const roomName =
            requestedName || `Room ${roomId}`;

        const room = await Room.create({
            roomId,
            name: roomName,
            ownerId: req.user._id
        });

        return res.status(201).json({
            roomId: room.roomId,
            name: room.name
        });
    } catch (error) {
        console.error("Create room error:", error);

        return res.status(500).json({
            message: "Could not create room"
        });
    }
};

export default createRoom;
