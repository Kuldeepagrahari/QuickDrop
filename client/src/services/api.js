import { auth } from "./firebase.js";

const API_URL = "http://localhost:5000/api";

const getAuthHeaders = async () => {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("You must be logged in");
    }

    const token = await user.getIdToken();

    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
    };
};

// CREATE ROOM
export const createRoom = async () => {
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_URL}/rooms`, {
        method: "POST",
        headers
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Could not create room"
        );
    }

    return data;
};

// GET / CHECK ROOM
export const getRoom = async (roomId) => {
    const headers = await getAuthHeaders();

    const response = await fetch(
        `${API_URL}/rooms/${roomId}`,
        {
            method: "GET",
            headers
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Room not found"
        );
    }

    return data;
};

// GET ROOM HISTORY
export const getItems = async (roomId) => {
    const headers = await getAuthHeaders();

    const response = await fetch(
        `${API_URL}/rooms/${roomId}/items`,
        {
            method: "GET",
            headers
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Could not load items"
        );
    }

    return data;
};

// SEND MESSAGE
export const sendItem = async (roomId, content) => {
    const headers = await getAuthHeaders();

    const response = await fetch(
        `${API_URL}/rooms/${roomId}/items`,
        {
            method: "POST",
            headers,
            body: JSON.stringify({
                content
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Could not send item"
        );
    }

    return data;
};

// CLEAR ROOM
export const clearRoom = async (roomId) => {
    const headers = await getAuthHeaders();

    const response = await fetch(
        `${API_URL}/rooms/${roomId}/items`,
        {
            method: "DELETE",
            headers
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Could not clear room"
        );
    }

    return data;
};

export const getCreatedRooms = async () => {
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_URL}/rooms/created`, {
        method: "GET",
        headers
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Could not load your rooms");
    }

    return data;
};

