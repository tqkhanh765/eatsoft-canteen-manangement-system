async function seedRoles(prisma) {
  console.log('Seeding Roles...');
  const roleNames = ['Admin', 'Vendor', 'Manager', 'Customer'];
  const roles = {};

  for (const name of roleNames) {
    roles[name] = await prisma.role.create({
      data: { RoleName: name },
    });
  }
  
  console.log('Created 4 Roles.');
  return roles;
}

module.exports = seedRoles;