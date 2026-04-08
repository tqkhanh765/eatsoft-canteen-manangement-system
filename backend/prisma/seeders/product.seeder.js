const { faker } = require('@faker-js/faker');

async function seedProducts(prisma, stores, categories) {
  console.log('Seeding Products...');
  const products = [];
  
  for (let i = 0; i < 100; i++) {
    const product = await prisma.product.create({
      data: {
        Name: faker.commerce.productName(),
        Price: parseFloat(faker.commerce.price({ min: 5, max: 100 })),
        ImageURL: faker.image.urlLoremFlickr({ category: 'food' }),
        IsAvailable: true,
        StoreID: faker.helpers.arrayElement(stores).StoreID,
        CategoryID: faker.helpers.arrayElement(categories).CategoryID,
      },
    });
    products.push(product);
  }
  
  console.log('Created 100 Products.');
  return products;
}

module.exports = seedProducts;