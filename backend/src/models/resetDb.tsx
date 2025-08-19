import sequelize from './index';
import Album from './Album';
import Track from './Track';
import Rating from './Rating';
import dotenv from 'dotenv';

dotenv.config();

const getSpotifyToken = async (): Promise<string> => {
    if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
        throw new Error('❌ Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET environment variables');
    }

    const authString = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64');
    const fetch = (await import('node-fetch')).default;

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            Authorization: `Basic ${authString}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
    });

    const data = await response.json();

    if (!data.access_token) {
        throw new Error(`Failed to obtain Spotify access token: ${JSON.stringify(data)}`);
    }

    return data.access_token;
};

(async () => {
    try {
        // Drop and recreate all tables
        await sequelize.sync({ force: true });
        console.log('✅ Database tables dropped and recreated');

        const sampleAlbumId = '4aawyAB9vmqN3uQ7FjRGTy'; // Replace with valid Spotify album ID
        const token = await getSpotifyToken();
        const fetch = (await import('node-fetch')).default;

        const response = await fetch(`https://api.spotify.com/v1/albums/${sampleAlbumId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (data.error) {
            throw new Error(`Spotify API error: ${data.error.message}`);
        }

        const artists = Array.isArray(data.artists) ? data.artists : [];
        const tracks = data.tracks?.items ?? [];

        // Upsert album
        await Album.upsert({
            id: data.id,
            title: data.name || 'Unknown Title',
            artist: artists.map((a: any) => a.name).join(', ') || 'Unknown Artist',
            releaseDate: data.release_date || null,
            imageUrl: data.images?.[0]?.url || null,
        });

        // Upsert tracks
        await Promise.all(
            tracks.map((t: any) =>
                Track.upsert({
                    id: t.id,
                    name: t.name,
                    durationMs: t.duration_ms,
                    albumId: data.id,
                })
            )
        );

        // Optional: Create sample ratings
        await Rating.create({
            id: 1,
            albumId: data.id,
            userId: 'sample-user',
            score: 5,
            comment: 'Excellent album!',
        });

        console.log('✅ Sample album, tracks, and ratings imported');
    } catch (err) {
        console.error('❌ Failed to reset database or import data', err);
    } finally {
        process.exit(0);
    }
})();
