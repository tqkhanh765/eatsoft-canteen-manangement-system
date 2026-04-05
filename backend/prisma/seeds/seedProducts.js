import { faker } from "@faker-js/faker";

export async function seedProducts(prisma, stores, categories) {
  const products = [];

  for (let i = 0; i < 100; i++) {
    const product = await prisma.product.create({
      data: {
        name: faker.commerce.productName(),
        price: parseFloat(faker.commerce.price()),
        imageURL: faker.image.url(),
        isAvailable: true,
        storeId: stores[Math.floor(Math.random() * stores.length)].storeId,
        categoryId: categories[Math.floor(Math.random() * categories.length)].categoryId,
      },
    });

    products.push(product);
  }

  console.log("✅ Products seeded");
  return products;
}