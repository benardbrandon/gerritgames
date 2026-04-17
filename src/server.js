// src/server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const compression = require('compression');
const morgan = require('morgan');
const methodOverride = require('method-override');

const app = express();

// ── Middleware ──────────────────────────────────────────────
app.use(compression());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, '../public')));

// ── View Engine ─────────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// ── Global template locals ──────────────────────────────────
app.use((req, res, next) => {
  res.locals.siteName = process.env.SITE_NAME || 'GerritGames';
  res.locals.currentYear = new Date().getFullYear();
  res.locals.currentPath = req.path;
  next();
});

// ── Routes ──────────────────────────────────────────────────
app.use('/', require('./routes/index'));
app.use('/games', require('./routes/games'));
app.use('/api', require('./routes/api'));

// ── 404 Handler ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).render('error', {
    title: '404 – Page Not Found',
    message: 'The page you are looking for does not exist.',
    code: 404
  });
});

// ── Global Error Handler ────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', {
    title: '500 – Server Error',
    message: process.env.NODE_ENV === 'production'
      ? 'Something went wrong. Please try again later.'
      : err.message,
    code: 500
  });
});

// ── Start ───────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🎮 GerritGames running at http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

module.exports = app;
