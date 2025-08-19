import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

let token: string;
let tokenExpiration: number;

async function getToken() {
    if (token && Date.now() < tokenExpiration) return token;

    const resp = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')
        },
        body: 'grant_type=client_credentials'
    });

    const data = await resp.json();
    token = data.access_token;
    tokenExpiration = Date.now() + data.expires_in * 1000;
    return token;
}

export async function searchAlbums(query: string) {
    const t = await getToken();
    const resp = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=album&limit=10`, {
        headers: { 'Authorization': `Bearer ${t}` }
    });
    return resp.json();
}

export async function getAlbum(id: string) {
    const t = await getToken();
    const resp = await fetch(`https://api.spotify.com/v1/albums/${id}`, {
        headers: { 'Authorization': `Bearer ${t}` }
    });
    return resp.json();
}