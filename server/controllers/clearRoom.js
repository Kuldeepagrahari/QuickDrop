import Room from "../models/rooms.js";
import Item from "../models/items.js";

const clearRoom = async (req, res) => {
    try {
        const roomId = req.params.roomId.toUpperCase();

        const room = await Room.findOne({
            roomId
        });

        if (!room) {
            return res.status(404).json({
                message: "Room not found"
            });
        }

        // Check room ownership
        if (room.ownerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Only the room owner can clear messages"
            });
        }

        await Item.deleteMany({
            roomId
        });

        return res.json({
            message: "Room messages cleared successfully"
        });
    } catch (error) {
        console.error("Clear room error:", error);

        return res.status(500).json({
            message: "Could not clear room"
        });
    }
};

export default clearRoom;