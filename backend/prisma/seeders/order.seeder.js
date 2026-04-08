const { faker } = require('@faker-js/faker');

async function seedOrders(prisma, stores, customers, products) {
  console.log('Seeding Orders, OrderItems, and Feedbacks...');
  let feedbackCount = 0;

  for (let i = 0; i < 50; i++) {
    const store = faker.helpers.arrayElement(stores);
    const customer = faker.helpers.arrayElement(customers);
    
    const storeProducts = products.filter(p => p.StoreID === store.StoreID);
    const availableProducts = storeProducts.length > 0 ? storeProducts : products;

    const numItems = 6; 
    let totalAmount = 0;
    const orderItemsData = [];

    for (let j = 0; j < numItems; j++) {
      const product = faker.helpers.arrayElement(availableProducts);
      const quantity = faker.number.int({ min: 1, max: 4 });
      const unitPrice = product.Price;
      totalAmount += (quantity * unitPrice);

      orderItemsData.push({
        Quantity: quantity,
        UnitPrice: unitPrice,
        ProductID: product.ProductID,
      });
    }

    const isCompleted = faker.number.int({ min: 1, max: 10 }) <= 9;
    const status = isCompleted ? 'Completed' : faker.helpers.arrayElement(['Pending', 'Cooking', 'Ready']);
    const orderDate = faker.date.recent({ days: 60 });

    const order = await prisma.order.create({
      data: {
        OrderDate: orderDate,
        Status: status,
        TotalAmount: totalAmount,
        CustomerID: customer.UserID,
        StoreID: store.StoreID,
        OrderItems: {
          create: orderItemsData,
        },
      },
      include: { OrderItems: true },
    });

    if (status === 'Completed') {
      for (const item of order.OrderItems) {
        await prisma.feedback.create({
          data: {
            Rating: faker.number.int({ min: 1, max: 5 }),
            Comment: faker.lorem.sentence(),
            CreatedAt: faker.date.soon({ days: 2, refDate: orderDate }),
            OrderItemID: item.OrderItemID,
          },
        });
        feedbackCount++;
      }
    }
  }
  
  console.log(`Created 50 Orders with ~300 OrderItems.`);
  console.log(`Created ${feedbackCount} Feedbacks.`);
}

module.exports = seedOrders;