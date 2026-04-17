// src/db.js
// Prisma Client Singleton — prevents connection exhaustion in dev hot-reload
const { PrismaClient } = require('@prisma/client');

const globalForPrisma = global;
const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error']
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

module.exports = prisma;
