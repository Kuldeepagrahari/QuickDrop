import Room from "../models/rooms.js";
import Item from "../models/items.js";

const getRoomHistory = async (req, res) => {
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

        const items = await Item.find({
            roomId
        })
            .sort({ createdAt: -1 })
            .limit(50);

        return res.json(items);
    } catch (error) {
        console.error("Get room history error:", error);

        return res.status(500).json({
            message: "Could not load room history"
        });
    }
};

export default getRoomHistory;