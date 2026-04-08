const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Import các file seeder
const seedRoles = require('./seeders/role.seeder');
const seedUsers = require('./seeders/user.seeder');
const seedCategories = require('./seeders/category.seeder');
const seedStores = require('./seeders/store.seeder');
const seedProducts = require('./seeders/product.seeder');
const seedOrders = require('./seeders/order.seeder');

async function clearDatabase() {
  console.log('Clearing existing data...');
  // Xóa ngược từ bảng con lên bảng cha để tránh lỗi Foreign Key
  await prisma.feedback.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.store.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();
  console.log('Database cleared.');
}

async function main() {
  console.log('Starting Database Seeding...');

  // 1. Xóa data cũ
  await clearDatabase();

  // 2. Chạy seeders theo thứ tự Dependency
  const roles = await seedRoles(prisma);
  const { vendors, customers } = await seedUsers(prisma, roles);
  
  const categories = await seedCategories(prisma);
  const stores = await seedStores(prisma, vendors);
  
  const products = await seedProducts(prisma, stores, categories);
  
  await seedOrders(prisma, stores, customers, products);

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });