const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

// Singleton: reuse one PrismaClient instance across the entire app
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
