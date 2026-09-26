import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    index: true
  },

  type: {
    type: String,
    enum: ["text"],
    default: "text"
  },

  content: {
    type: String,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});
const Item = mongoose.model("Item", itemSchema);
export default Item;