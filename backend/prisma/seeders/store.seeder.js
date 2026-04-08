const { faker } = require('@faker-js/faker');

async function seedStores(prisma, vendors) {
  console.log('Seeding Stores...');
  const stores = [];
  
  for (let i = 0; i < 9; i++) {
    const store = await prisma.store.create({
      data: {
        StoreName: faker.company.name() + ' Food Stall',
        Description: faker.company.catchPhrase(),
        Location: faker.location.streetAddress(),
        IsOpen: true,
        OwnerID: vendors[i].UserID,
      },
    });
    stores.push(store);
  }
  
  console.log('Created 9 Stores.');
  return stores;
}

module.exports = seedStores;