import Room from "../models/rooms.js";
import User from "../models/users.js";

const joinRoom = async (req, res) => {
    try {
        const roomId = req.params.roomId.toUpperCase();

        const room = await Room.findOne({ roomId });

        if (!room) {
            return res.status(404).json({
                message: "Room not found"
            });
        }

        const owner = await User.findById(room.ownerId).select(
            "firebaseUid name picture"
        );

        return res.json({
            roomId: room.roomId,
            name:
                room.name?.trim() ||
                `Room ${room.roomId}`,
            ownerId: owner?.firebaseUid || null,
            ownerName: owner?.name || "Unknown",
            ownerPicture: owner?.picture || ""
        });
    } catch (error) {
        console.error("Join room error:", error);

        return res.status(500).json({
            message: "Could not find room"
        });
    }
};

export default joinRoom;
