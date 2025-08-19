import axios from "axios";

const API_BASE = "http://localhost:4000"; // replace with your backend URL

export const fetchAlbums = async () => {
    const response = await axios.get(`${API_BASE}/albums`);
    return response.data;
};

export const fetchAlbumDetails = async (albumId: string) => {
    const response = await axios.get(`${API_BASE}/albums/${albumId}`);
    return response.data;
};

export const createRating = async (albumId: string, score: number, comment: string) => {
    const response = await axios.post(`${API_BASE}/ratings`, {
        albumId,
        score,
        comment,
        userId: "sample-user",
    });
    return response.data;
};

// Fetch all users
export const fetchUsers = async () => {
    console.log("fetch Users");
    const response = await axios.get(`${API_BASE}/users`);
    return response.data;
};

// Update user permissions
export const updateUserPermissions = async (userId: string, newRole: string) => {
    const response = await axios.patch(`${API_BASE}/users/${userId}`, { role: newRole });
    return response.data;
};
