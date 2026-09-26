import Room from "../models/rooms.js";
import Item from "../models/items.js";

const deleteRoom = async (req, res) => {
    try {
        const roomId = req.params.roomId.toUpperCase();

        const room = await Room.findOne({ roomId });

        if (!room) {
            return res.status(404).json({
                message: "Room not found"
            });
        }

        if (
            room.ownerId.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                message: "Only the room owner can delete this room"
            });
        }

        await Item.deleteMany({ roomId });
        await Room.deleteOne({ _id: room._id });

        return res.json({
            message: "Room deleted successfully",
            roomId
        });
    } catch (error) {
        console.error("Delete room error:", error);

        return res.status(500).json({
            message: "Could not delete room"
        });
    }
};

export default deleteRoom;
