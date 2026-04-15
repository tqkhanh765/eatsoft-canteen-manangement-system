const { faker } = require('@faker-js/faker');

async function seedUsers(prisma, roles) {
  console.log('Seeding Users...');
  const vendors = [];
  const customers = [];

  async function createUsers(role, count, targetArray = null) {
    for (let i = 0; i < count; i++) {
      const user = await prisma.user.create({
        data: {
          Username: faker.internet.userName(),
          Password: faker.internet.password(), 
          Email: faker.internet.email(),
          Phone: faker.phone.number(),
          Status: 'Active',
          RoleID: role.RoleID,
        },
      });
      if (targetArray) targetArray.push(user);
    }
  }

  await createUsers(roles['Admin'], 2);
  await createUsers(roles['Manager'], 3);
  await createUsers(roles['Vendor'], 9, vendors);
  await createUsers(roles['Customer'], 16, customers);
  
  console.log('Created 30 Users.');
  return { vendors, customers }; // Trả về Vendors và Customers để dùng tạo Store và Order
}

module.exports = seedUsers;