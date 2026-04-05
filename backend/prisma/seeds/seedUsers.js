import { faker } from "@faker-js/faker";

export async function seedUsers(prisma, roles) {
  const users = [];

  const roleMap = {};
  roles.forEach(r => (roleMap[r.roleName] = r));

  const getRole = (i) => {
    if (i < 2) return "ADMIN";
    if (i < 11) return "VENDOR";
    if (i < 14) return "MANAGER";
    return "CUSTOMER";
  };

  for (let i = 0; i < 30; i++) {
    const role = roleMap[getRole(i)];

    const user = await prisma.user.create({
      data: {
        username: faker.internet.username(),
        email: faker.internet.email(),
        password: "123456",
        phone: faker.phone.number(),
        status: true,
        roleId: role.roleId,
      },
    });

    users.push(user);
  }

  console.log("✅ Users seeded");
  return users;
}