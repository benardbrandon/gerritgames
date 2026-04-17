// src/routes/games.js
const router = require('express').Router();
const multer = require('multer');
const prisma = require('../db');
const { parseMagnet, parseTorrentFile } = require('../controllers/torrentController');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

// ── Search ──────────────────────────────────────────────────
router.get('/search', async (req, res, next) => {
  try {
    const LIMIT = parseInt(process.env.ITEMS_PER_PAGE) || 12;
    const q = (req.query.q || '').trim();
    const page = Math.max(1, parseInt(req.query.page) || 1);

    if (!q) return res.redirect('/');

    const where = {
      isActive: true,
      OR: [
        { title: { contains: q } },
        { description: { contains: q } }
      ]
    };

    const [games, total] = await Promise.all([
      prisma.game.findMany({
        where,
        include: { categories: { include: { category: true } } },
        orderBy: { downloads: 'desc' },
        skip: (page - 1) * LIMIT,
        take: LIMIT
      }),
      prisma.game.count({ where })
    ]);

    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
    const totalPages = Math.ceil(total / LIMIT);

    res.render('search', { games, categories, q, page, totalPages, total, title: `Search: "${q}"` });
  } catch (err) { next(err); }
});

// ── Game Detail Page ────────────────────────────────────────
router.get('/:slug', async (req, res, next) => {
  try {
    const game = await prisma.game.findUnique({
      where: { slug: req.params.slug, isActive: true },
      include: {
        requirements: true,
        categories: { include: { category: true } },
        fileList: { orderBy: { path: 'asc' } }
      }
    });

    if (!game) return res.status(404).render('error', { title: '404', message: 'Game not found', code: 404 });

    // Related games (same categories, excluding self)
    const catIds = game.categories.map(gc => gc.categoryId);
    const related = await prisma.game.findMany({
      where: {
        isActive: true,
        id: { not: game.id },
        categories: { some: { categoryId: { in: catIds } } }
      },
      select: { title: true, slug: true, thumbnailUrl: true, fileSize: true },
      take: 4
    });

    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });

    res.render('games/detail', { game, related, categories, title: game.title });
  } catch (err) { next(err); }
});

// ── Download Trigger: increment counter ─────────────────────
// Called via fetch() when user clicks Download
router.post('/:slug/download', async (req, res, next) => {
  try {
    const game = await prisma.game.update({
      where: { slug: req.params.slug },
      data: { downloads: { increment: 1 } },
      select: { magnetUri: true, downloads: true, title: true }
    });
    res.json({ ok: true, magnetUri: game.magnetUri, title: game.title });
  } catch (err) {
    res.status(404).json({ ok: false, error: 'Game not found' });
  }
});

// ── Admin: parse torrent file and extract metadata ──────────
router.post('/admin/parse-torrent', upload.single('torrent'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const metadata = await parseTorrentFile(req.file.buffer);
    res.json({ ok: true, metadata });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

module.exports = router;
