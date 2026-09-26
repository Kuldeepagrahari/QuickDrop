import express from "express";
import Room from "../models/rooms.js";
import crypto from "crypto";

const createRoom = async (req, res) => {
    try {
            const roomId = crypto
                .randomBytes(3)
                .toString("hex")
                .toUpperCase();
    
            const room = await Room.create({
                roomId
            });
    
            return res.status(201).json({
                roomId: room.roomId
            });
    
        } catch (error) {
            console.error(error);
    
            return res.status(500).json({
                message: "Could not create room"
            });
        }
}

export default createRoom;