import Item from "../models/items.js";

const getRoomHistory = async (req, res) => {
    try {
            const roomId = req.params.roomId.toUpperCase();
    
            const items = await Item.find({
                roomId
            })
                .sort({ createdAt: -1 })
                .limit(50);
    
            return res.json(items);
    
        } catch (error) {
            console.error(error);
    
            return res.status(500).json({
                message: "Could not load items"
            });
        }
}

export default getRoomHistory;