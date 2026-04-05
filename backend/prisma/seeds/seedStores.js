import { faker } from "@faker-js/faker";

export async function seedStores(prisma, users, roles) {
  const vendors = users.filter(u => {
    const role = roles.find(r => r.roleId === u.roleId);
    return role.roleName === "VENDOR";
  });

  const stores = [];

  for (let i = 0; i < 9; i++) {
    const store = await prisma.store.create({
      data: {
        storeName: faker.company.name(),
        description: faker.company.catchPhrase(),
        isOpen: true,
        location: faker.location.city(),
        ownerId: vendors[i % vendors.length].userId,
      },
    });

    stores.push(store);
  }

  console.log("✅ Stores seeded");
  return stores;
}