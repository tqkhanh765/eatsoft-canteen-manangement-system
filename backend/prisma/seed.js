const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Helpers to generate hardcoded yet diverse data
function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randomElement(arr) { return arr[randomInt(0, arr.length - 1)]; }

async function main() {
  console.log('🌱 Start PostgreSQL database seeding...');
  
  console.log('Clearing old data...');
  await prisma.feedback.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.store.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();

  // ----------------------------------------
  // 1. SEED ROLES (4 Roles)
  // ----------------------------------------
  console.log('Seeding Roles...');
  const roles = await Promise.all([
    prisma.role.create({ data: { roleName: 'Admin' } }),
    prisma.role.create({ data: { roleName: 'Vendor' } }),
    prisma.role.create({ data: { roleName: 'Manager' } }),
    prisma.role.create({ data: { roleName: 'Customer' } })
  ]);
  const [roleAdmin, roleVendor, roleManager, roleCustomer] = roles;

  // ----------------------------------------
  // 2. SEED CATEGORIES (~15)
  // ----------------------------------------
  console.log('Seeding Categories...');
  const categoryNames = [
    'Cơm', 'Phở/Bún', 'Món Nước', 'Bánh Mì', 'Xiên Que', 
    'Cà Phê', 'Trà Sữa', 'Sinh Tố', 'Nước Ngọt', 'Trà Trái Cây',
    'Đồ Chay', 'Tráng Miệng', 'Gà Rán', 'Pizza/Mỳ Ý', 'Đồ Ăn Vặt Hàn Quốc'
  ];
  const categories = [];
  for (const name of categoryNames) {
    categories.push(await prisma.category.create({ data: { categoryName: name } }));
  }

  // ----------------------------------------
  // 3. SEED USERS (~30 users total)
  // ----------------------------------------
  console.log('Seeding Users...');
  
  // 2 Admins
  const admins = [];
  for(let i=1; i<=2; i++) {
    admins.push(await prisma.user.create({ data: { userName: `Quản Trị ${i}`, email: `admin${i}@eatsoft.com`, password: 'hashed_password_123', phone: '090000000' + i, status: 'Active', roleId: roleAdmin.roleId } }));
  }

  // 9 Vendors
  const vendors = []; 
  for(let i=1; i<=9; i++) {
    vendors.push(await prisma.user.create({ data: { userName: `Chủ Quán ${i}`, email: `vendor${i}@eatsoft.com`, password: 'hashed_password_123', phone: '091000000' + i, status: 'Active', roleId: roleVendor.roleId } }));
  }

  // 3 Managers
  const managers = [];
  for(let i=1; i<=3; i++) {
    managers.push(await prisma.user.create({ data: { userName: `Bộ Phận Quản Lý ${i}`, email: `manager${i}@eatsoft.com`, password: 'hashed_password_123', phone: '092000000' + i, status: 'Active', roleId: roleManager.roleId } }));
  }

  // 16 Customers
  const customers = [];
  for(let i=1; i<=16; i++) {
    customers.push(await prisma.user.create({ data: { userName: `Sinh Viên ${i}`, email: `customer${i}@student.hcmiu.edu.vn`, password: 'hashed_password_123', phone: '09300000' + (10+i), status: 'Active', roleId: roleCustomer.roleId } }));
  }

  // ----------------------------------------
  // 4. SEED STORES (9 stores)
  // ----------------------------------------
  console.log('Seeding Stores...');
  const storeNames = ['Cơm Việt', 'B&B', 'Sushi Cười', 'H&D', 'Gạo & Nồi', 'T&D', 'BigU', 'Coffee Story', 'The Zero Coffee'];
  const stores = [];
  for(let i=0; i<storeNames.length; i++) {
    stores.push(await prisma.store.create({
      data: {
        storeName: storeNames[i],
        description: `Chào mừng đến với cửa hàng ${storeNames[i]} tại Canteen IU.`,
        location: `Khu vực sảnh số ${i+1}`,
        managerId: vendors[i].userId // Map exact 9 vendors to the 9 stores
      }
    }));
  }

  // ----------------------------------------
  // 5. SEED PRODUCTS (~100 products total, 11 per store)
  // ----------------------------------------
  console.log('Seeding Products...');
  const productAdjectives = ['Đặc Biệt', 'Truyền Thống', 'Xào Cay', 'Phô Mai', 'Trứng Muối', 'Chua Ngọt', 'Cháy Tỏi', 'Thập Cẩm', 'Quay Da Giòn', 'Cà Ri'];
  const products = [];
  
  for(const store of stores) {
    for(let j=1; j<=11; j++) {
      const cat = randomElement(categories);
      const adj = randomElement(productAdjectives);
      const prodName = `${cat.categoryName} ${adj} ${j}`;
      const priceVal = randomInt(15, 65) * 1000; // Between 15k and 65k
      
      const p = await prisma.product.create({
        data: {
          storeId: store.storeId,
          categoryId: cat.categoryId,
          name: prodName,
          price: priceVal,
          isAvailable: true,
          imageURL: 'https://placehold.co/200x200/png'
        }
      });
      products.push(p);
    }
  }

  // ----------------------------------------
  // 6. SEED ORDERS, ORDER ITEMS, AND FEEDBACKS
  // ----------------------------------------
  // To get EXACTLY 50 Orders and exactly 300 Feedbacks:
  // 50 orders * 6 unique order items per order = 300 order items.
  // Each order item will have exactly 1 Feedback = 300 feedbacks!
  console.log('Seeding Orders, Order Items, and Feedbacks...');
  
  const comments = [
    'Quá ngon luôn!', 'Đồ ăn tuyệt vời, đầy đặn.', 'Hơi mặn một tí nhưng vẫn ngon.', 
    'Giao đồ làm rất nhanh.', 'Mức giá rất đáng tiền.', 'Bình thường, dễ ăn.', 
    'Chắc chắn sẽ quay lại ủng hộ!', 'Khá ok cho sinh viên.', 'Ăn ngon miệng.', 
    'Tuyệt đỉnh, sốt làm rất đậm đà.'
  ];

  for(let i=1; i<=50; i++) {
    const orderItemsData = [];
    let totalAmount = 0;
    
    // We create exactly 6 items per order
    for(let k=0; k<6; k++) {
      const product = randomElement(products);
      const qty = randomInt(1, 3);
      const unitPrice = Number(product.price);
      totalAmount += unitPrice * qty;
      
      orderItemsData.push({
        productId: product.productId,
        quantity: qty,
        unitPrice: unitPrice,
        feedback: {
          create: {
            rating: randomInt(4, 5), // Keep ratings generally high!
            comment: randomElement(comments)
          }
        }
      });
    }

    await prisma.order.create({
      data: {
        userId: randomElement(customers).userId,
        storeId: randomElement(stores).storeId,
        totalAmount: totalAmount,
        status: 'Completed',
        orderItems: {
          create: orderItemsData
        }
      }
    });

    if (i % 10 === 0) {
      console.log(`... Da tao duoc ${i}/50 don hang (kem theo Feedback)`);
    }
  }

  console.log('✅ Seed data successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });