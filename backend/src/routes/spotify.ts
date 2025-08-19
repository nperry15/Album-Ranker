import express from 'express';
import { searchAlbums, getAlbum } from '../services/spotifyService';
import { authRequired, adminRequired } from '../middleware/auth';
import Album from '../models/Album';
import Track from '../models/Track';

const router = express.Router();

// Admin-only import endpoint
router.post('/import/:id', authRequired, adminRequired, async (req, res) => {
    try {
        const data = await getAlbum(req.params.id);

        if (data.error) {
            return res.status(data.error.status || 500).json({ error: data.error.message });
        }

        // Save album
        await Album.upsert({
            id: data.id,
            title: data.name,  // Spotify album name mapped to 'title'
            artist: data.artists.map((a: any) => a.name).join(', '),
            imageUrl: data.images?.[0]?.url || null,
        });

        // Save tracks
        await Promise.all(
            data.tracks.items.map((t: any) =>
                Track.upsert({
                    id: t.id,
                    name: t.name || 'Unknown',
                    durationMs: t.duration_ms || 0,
                    albumId: data.id,
                })
            )
        );

        res.json({ message: 'Album imported successfully', album: data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to import album' });
    }
});


// Search endpoint (public)
router.get('/search', async (req, res) => {
    try {
        const query = req.query.q as string;
        const results = await searchAlbums(query);
        res.json(results.albums.items);
    } catch (err) {
        res.status(500).json({ error: 'Spotify search failed' });
    }
});

export default router;