import { faker } from "@faker-js/faker";

export async function seedFeedbacks(prisma, orders) {
  for (const order of orders) {
    await prisma.feedback.create({
      data: {
        orderId: order.orderId,
        rating: faker.number.int({ min: 1, max: 5 }),
        comment: faker.lorem.sentence(),
        createdAt: faker.date.recent(),
      },
    });
  }

  console.log("✅ Feedbacks seeded");
}