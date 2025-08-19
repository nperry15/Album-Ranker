import { Router } from 'express';
import Album from '../models/Album';
import Track from '../models/Track';
import { authRequired } from './middleware';

const router = Router();

// List all albums with tracks
router.get('/', authRequired, async (req, res) => {
    try {
        const albums = await Album.findAll({ include: Track, order: [['title', 'ASC']] });
        res.json(albums);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch albums' });
    }
});

// Get single album by ID
router.get('/:id', authRequired, async (req, res) => {
    try {
        const album = await Album.findByPk(req.params.id, { include: Track });
        if (!album) return res.status(404).json({ error: 'Album not found' });
        res.json(album);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch album' });
    }
});

export default router;