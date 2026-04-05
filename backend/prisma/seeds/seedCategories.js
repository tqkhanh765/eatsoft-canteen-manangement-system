import { faker } from "@faker-js/faker";

export async function seedCategories(prisma) {
  const categories = [];

  for (let i = 0; i < 15; i++) {
    const cat = await prisma.category.create({
      data: {
        categoryName: faker.commerce.department(),
      },
    });

    categories.push(cat);
  }

  console.log("✅ Categories seeded");
  return categories;
}