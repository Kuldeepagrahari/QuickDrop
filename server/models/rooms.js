import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
    {
        roomId: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true
        },

        name: {
            type: String,
            trim: true,
            maxlength: 50,
            default: ""
        },

        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Room = mongoose.model("Room", roomSchema);

export default Room;
