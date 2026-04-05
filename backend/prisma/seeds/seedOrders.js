import { faker } from "@faker-js/faker";

export async function seedOrders(prisma, users, roles, products, stores) {
  const customers = users.filter(u => {
    const role = roles.find(r => r.roleId === u.roleId);
    return role.roleName === "CUSTOMER";
  });

  const orders = [];

  for (let i = 0; i < 50; i++) {
    const store = stores[Math.floor(Math.random() * stores.length)];
    const storeProducts = products.filter(p => p.storeId === store.storeId);

    if (storeProducts.length === 0) continue;

    const order = await prisma.order.create({
      data: {
        orderDate: faker.date.recent(),
        status: "COMPLETED",
        totalAmount: 0,
        customerId: customers[Math.floor(Math.random() * customers.length)].userId,
        storeId: store.storeId,
      },
    });

    let total = 0;

    const numItems = faker.number.int({ min: 1, max: 3 });

    for (let j = 0; j < numItems; j++) {
      const product = storeProducts[Math.floor(Math.random() * storeProducts.length)];
      const quantity = faker.number.int({ min: 1, max: 5 });

      total += product.price * quantity;

      await prisma.orderItem.create({
        data: {
          orderId: order.orderId,
          productId: product.productId,
          quantity,
          unitPrice: product.price,
        },
      });
    }

    await prisma.order.update({
      where: { orderId: order.orderId },
      data: { totalAmount: total },
    });

    orders.push(order);
  }

  console.log("✅ Orders seeded");
  return orders;
}