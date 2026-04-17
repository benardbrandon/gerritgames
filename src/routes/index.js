// src/routes/index.js
const router = require('express').Router();
const prisma = require('../db');

// Home page
router.get('/', async (req, res, next) => {
  try {
    const [featured, mostDownloaded, categories] = await Promise.all([
      // Featured games for the banner
      prisma.game.findMany({
        where: { isFeatured: true, isActive: true },
        select: { title: true, slug: true, thumbnailUrl: true, bannerUrl: true },
        take: 6
      }),
      // Most downloaded sidebar
      prisma.game.findMany({
        where: { isActive: true },
        orderBy: { downloads: 'desc' },
        select: { title: true, slug: true, thumbnailUrl: true, downloads: true },
        take: 12
      }),
      // All categories for sidebar
      prisma.category.findMany({
        include: { _count: { select: { games: true } } },
        orderBy: { name: 'asc' }
      }),
      // Latest games for main grid
    ]);

    const latestGames = await prisma.game.findMany({
      where: { isActive: true },
      include: {
        categories: { include: { category: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 9
    });

    res.render('index', { featured, mostDownloaded, categories, latestGames, title: 'Home' });
  } catch (err) { next(err); }
});

// About page
router.get('/about', (req, res) => {
  res.render('about', { title: 'About GerritGames' });
});

// Contact page
router.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact Us' });
});

// Category filter
router.get('/category/:slug', async (req, res, next) => {
  try {
    const LIMIT = parseInt(process.env.ITEMS_PER_PAGE) || 12;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const { slug } = req.params;

    const category = await prisma.category.findUnique({ where: { slug } });
    if (!category) return res.status(404).render('error', { title: '404', message: 'Category not found', code: 404 });

    const [games, total] = await Promise.all([
      prisma.game.findMany({
        where: { isActive: true, categories: { some: { category: { slug } } } },
        include: { categories: { include: { category: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * LIMIT,
        take: LIMIT
      }),
      prisma.game.count({
        where: { isActive: true, categories: { some: { category: { slug } } } }
      })
    ]);

    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
    const totalPages = Math.ceil(total / LIMIT);

    res.render('category', { category, games, categories, page, totalPages, total, title: category.name });
  } catch (err) { next(err); }
});

module.exports = router;
