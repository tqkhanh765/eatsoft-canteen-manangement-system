export async function seedRoles(prisma) {
  const roles = ["ADMIN", "VENDOR", "MANAGER", "CUSTOMER"];

  const result = [];

  for (const role of roles) {
    const existing = await prisma.role.findUnique({
      where: { roleName: role },
    });

    if (existing) {
      result.push(existing);
    } else {
      const created = await prisma.role.create({
        data: { roleName: role },
      });
      result.push(created);
    }
  }

  console.log("✅ Roles seeded");
  return result;
}