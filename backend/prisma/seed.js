// backend/prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // Example: Delete existing data to start fresh (Optional warning: deletes data!)
  await prisma.order.deleteMany();
  await prisma.user.deleteMany();

  // Create a fake Customer
  const customer = await prisma.user.create({
    data: {
      email: 'customer@eatsoft.com',
      password: 'hashedpassword123', // REMEMBER: if using bcrypt, hash this!
      role: 'customer',
    },
  });

  console.log(`Created test user with id: ${customer.id}`);
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Ensures Prisma gracefully disconnects
    await prisma.$disconnect();
  });
