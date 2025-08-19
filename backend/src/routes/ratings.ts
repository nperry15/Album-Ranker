import { Router } from 'express';
import Rating from '../models/Rating';
import { authRequired } from './middleware';

const router = Router();

// Create or update a rating
router.post('/', authRequired, async (req, res) => {
    const { userId, albumId, trackId, score, comment } = req.body;
    try {
        const [rating] = await Rating.upsert({
            id: `${userId}-${albumId}${trackId ? '-' + trackId : ''}`,
            userId,
            albumId,
            trackId: trackId || null,
            score,
            comment,
        });
        res.json(rating);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save rating' });
    }
});

// Get all ratings for an album
router.get('/album/:albumId', authRequired, async (req, res) => {
    try {
        const ratings = await Rating.findAll({ where: { albumId: req.params.albumId } });
        res.json(ratings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch ratings' });
    }
});

export default router;