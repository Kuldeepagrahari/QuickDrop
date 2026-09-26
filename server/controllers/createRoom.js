import crypto from "crypto";

import Room from "../models/rooms.js";

const createRoom = async (req, res) => {
    try {
        const roomId = crypto
            .randomBytes(3)
            .toString("hex")
            .toUpperCase();

        const room = await Room.create({
            roomId,
            ownerId: req.user._id
        });

        return res.status(201).json({
            roomId: room.roomId
        });
    } catch (error) {
        console.error("Create room error:", error);

        return res.status(500).json({
            message: "Could not create room"
        });
    }
};

export default createRoom;