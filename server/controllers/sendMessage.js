import Room from "../models/rooms.js";
import Item from "../models/items.js";

const sendMessage = async (req, res) => {
    try {
            const roomId = req.params.roomId.toUpperCase();
            const { content } = req.body;
    
            if (!content || !content.trim()) {
                return res.status(400).json({
                    message: "Content is required"
                });
            }
    
            const room = await Room.findOne({
                roomId
            });
    
            if (!room) {
                return res.status(404).json({
                    message: "Room not found"
                });
            }
    
            const item = await Item.create({
                roomId,
                type: "text",
                content: content.trim()
            });
    
            return res.status(201).json(item);
    
        } catch (error) {
            console.error(error);
    
            return res.status(500).json({
                message: "Could not send item"
            });
        }
}

export default sendMessage;