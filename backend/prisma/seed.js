import { PrismaClient } from "@prisma/client";

import { seedRoles } from "./seeds/seedRoles.js";
import { seedUsers } from "./seeds/seedUsers.js";
import { seedStores } from "./seeds/seedStores.js";
import { seedCategories } from "./seeds/seedCategories.js";
import { seedProducts } from "./seeds/seedProducts.js";
import { seedOrders } from "./seeds/seedOrders.js";
import { seedFeedbacks } from "./seeds/seedFeedbacks.js";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Start seeding...");

  const roles = await seedRoles(prisma);
  const users = await seedUsers(prisma, roles);

  const stores = await seedStores(prisma, users, roles);
  const categories = await seedCategories(prisma);

  const products = await seedProducts(prisma, stores, categories);

  const orders = await seedOrders(prisma, users, roles, products, stores);

  await seedFeedbacks(prisma, orders);

  console.log("🎉 DONE!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());