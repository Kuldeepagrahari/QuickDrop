import Room from "../models/rooms.js";

const joinRoom = async (req, res) => {
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

        return res.json({
            roomId: room.roomId
        });
    } catch (error) {
        console.error("Join room error:", error);

        return res.status(500).json({
            message: "Could not find room"
        });
    }
};

export default joinRoom;