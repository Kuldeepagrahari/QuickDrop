import Room from "../models/rooms.js";
import Item from "../models/items.js";

const getCreatedRooms = async (req, res) => {
    try {
        const rooms = await Room.find({
            ownerId: req.user._id
        })
            .sort({ createdAt: -1 })
            .lean();

        const roomsWithStats = await Promise.all(
            rooms.map(async (room) => {
                const itemCount = await Item.countDocuments({
                    roomId: room.roomId
                });

                return {
                    roomId: room.roomId,
                    createdAt: room.createdAt,
                    itemCount
                };
            })
        );

        return res.json(roomsWithStats);
    } catch (error) {
        console.error("Get created rooms error:", error);

        return res.status(500).json({
            message: "Could not load your rooms"
        });
    }
};

export default getCreatedRooms;