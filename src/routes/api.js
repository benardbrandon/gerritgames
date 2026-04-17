// src/routes/api.js
const router = require('express').Router();
const prisma = require('../db');

// Autocomplete / live search suggestions
router.get('/search', async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (q.length < 2) return res.json([]);

    const games = await prisma.game.findMany({
      where: {
        isActive: true,
        title: { contains: q }
      },
      select: { title: true, slug: true, thumbnailUrl: true, fileSize: true },
      take: 6
    });

    res.json(games);
  } catch (err) {
    res.status(500).json({ error: 'Search failed' });
  }
});

// Stats endpoint
router.get('/stats', async (req, res) => {
  try {
    const [gameCount, totalDownloads] = await Promise.all([
      prisma.game.count({ where: { isActive: true } }),
      prisma.game.aggregate({ _sum: { downloads: true } })
    ]);
    res.json({
      games: gameCount,
      downloads: totalDownloads._sum.downloads || 0
    });
  } catch (err) {
    res.status(500).json({ error: 'Stats unavailable' });
  }
});

module.exports = router;
