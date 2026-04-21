const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

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
  await prisma.announcement.deleteMany();
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
    const uniqueHash = await bcrypt.hash('password123', 10);
    admins.push(await prisma.user.create({ data: { userName: `Quản Trị ${i}`, email: `admin${i}@eatsoft.com`, password: uniqueHash, phone: '090000000' + i, status: 'Active', roleId: roleAdmin.roleId } }));
  }

  // 6 Vendors (one for each store)
  const vendors = []; 
  for(let i=1; i<=6; i++) {
    const uniqueHash = await bcrypt.hash('password123', 10);
    vendors.push(await prisma.user.create({ data: { userName: `Chủ Quán ${i}`, email: `vendor${i}@eatsoft.com`, password: uniqueHash, phone: '091000000' + i, status: 'Active', roleId: roleVendor.roleId } }));
  }

  // 3 Managers
  const managers = [];
  for(let i=1; i<=3; i++) {
    const uniqueHash = await bcrypt.hash('password123', 10);
    managers.push(await prisma.user.create({ data: { userName: `Bộ Phận Quản Lý ${i}`, email: `manager${i}@eatsoft.com`, password: uniqueHash, phone: '092000000' + i, status: 'Active', roleId: roleManager.roleId } }));
  }

  // 16 Customers
  const customerNames = [
    'Nguyễn Văn An', 'Trần Thị Bảo', 'Lê Hoàng Cường', 'Phạm Quỳnh Dung', 'Hoàng Thái Hưng',
    'Vũ Phương Linh', 'Đặng Đình Mạnh', 'Bùi Ngọc Mai', 'Đỗ Minh Trí', 'Hồ Thu Thảo',
    'Ngô Quốc Khánh', 'Dương Hải Đăng', 'Lý Ái Như', 'Đào Minh Quân', 'Đoàn Thanh Trúc',
    'Trịnh Gia Bảo'
  ];
  const customers = [];
  for(let i=0; i<16; i++) {
    const uniqueHash = await bcrypt.hash('password123', 10);
    customers.push(await prisma.user.create({ data: { userName: customerNames[i], email: `customer${i+1}@student.hcmiu.edu.vn`, password: uniqueHash, phone: '09300000' + (10+i), status: 'Active', roleId: roleCustomer.roleId } }));
  }

  // ----------------------------------------
  // 4. SEED STORES (6 stores to match frontend mock data)
  // ----------------------------------------
  console.log('Seeding Stores...');
  const storeNames = ['Big U', 'Cơm Việt', 'H&D Food Court', 'Gạo & Nồi', 'Coffee Story', 'The Zero Coffee'];
  const stores = [];
  for(let i=0; i<storeNames.length; i++) {
    stores.push(await prisma.store.create({
      data: {
        storeName: storeNames[i],
        description: `Chào mừng đến với cửa hàng ${storeNames[i]} tại Canteen IU.`,
        location: `Khu vực sảnh số ${i+1}`,
        managerId: vendors[i].userId // Map exact 6 vendors to the 6 stores
      }
    }));
  }

  // ----------------------------------------
  // 5. SEED PRODUCTS (~100 products total, 11 per store)
  // ----------------------------------------
  console.log('Seeding Products...');
  const properProducts = {
    'Cơm': ['Cơm Chiên Dương Châu', 'Cơm Tấm Sườn Bì', 'Cơm Gà Xối Mỡ', 'Cơm Chiên Hải Sản', 'Cơm Ba Rọi Xào Sả Ớt', 'Cơm Thập Cẩm'],
    'Phở/Bún': ['Phở Bò Tái Nạm', 'Bún Bò Huế', 'Bún Thịt Nướng', 'Bún Chả Hà Nội', 'Phở Gà', 'Bún Mọc'],
    'Món Nước': ['Hủ Tiếu Nam Vang', 'Mì Quảng', 'Bánh Canh Cua', 'Mì Hoành Thánh', 'Súp Cua', 'Nui Nước Xương'],
    'Bánh Mì': ['Bánh Mì Ốp La', 'Bánh Mì Chả Lụa', 'Bánh Mì Thịt Nướng', 'Bánh Mì Xíu Mại', 'Bánh Mì Heo Quay', 'Bánh Mì Bò Né'],
    'Xiên Que': ['Cá Viên Chiên', 'Xúc Xích Chiên', 'Hồ Lô Nướng', 'Bò Viên', 'Phô Mai Que', 'Cá Viên Cà Ri'],
    'Cà Phê': ['Cà Phê Đen Đá', 'Cà Phê Sữa Đá', 'Bạc Xỉu', 'Cà Phê Muối', 'Capuchino', 'Latte'],
    'Trà Sữa': ['Trà Sữa Trân Châu', 'Trà Sữa Thái Xanh', 'Trà Sữa Matcha', 'Hồng Trà Sữa', 'Trà Sữa Khoai Môn', 'Trà Sữa Đường Đen'],
    'Sinh Tố': ['Sinh Tố Bơ', 'Sinh Tố Dâu', 'Sinh Tố Xoài', 'Sinh Tố Mãng Cầu', 'Sinh Tố Dưa Hấu', 'Nước Ép Táo'],
    'Nước Ngọt': ['Coca Cola', 'Pepsi', 'Sprite', '7Up', 'Mirinda', 'Sting'],
    'Trà Trái Cây': ['Trà Đào Cam Sả', 'Trà Vải', 'Trà Dâu', 'Trà Tắc', 'Trà Ổi Hồng', 'Lục Trà Chanh'],
    'Đồ Chay': ['Cơm Chay', 'Bún Xào Chay', 'Đậu Hũ Tứ Xuyên Chay', 'Gỏi Cuốn Chay', 'Canh Chua Chay', 'Mì Căn Xào Sả Ớt'],
    'Tráng Miệng': ['Bánh Flan', 'Rau Câu Sơn Thủy', 'Sữa Chua Trân Châu', 'Chè Dưỡng Nhan', 'Chè Thái', 'Bánh Mousse'],
    'Gà Rán': ['Gà Rán Phần M', 'Gà Rán Cay', 'Cánh Gà Sốt Tương', 'Gà Viên Chiên', 'Đùi Gà Rán', 'Gà Sốt Phô Mai'],
    'Pizza/Mỳ Ý': ['Pizza Hải Sản', 'Pizza Xúc Xích', 'Mỳ Ý Hải Sản', 'Mỳ Ý Bò Băm', 'Pizza Phô Mai', 'Mỳ Ý Carbonara'],
    'Đồ Ăn Vặt Hàn Quốc': ['Tteokbokki', 'Kimbap', 'Chả Cá Xiên', 'Mì Cay Bò', 'Tteokbokki Phô Mai', 'Mì Trộn Tương Đen']
  };

  const products = [];
  
  for(const store of stores) {
    for(let j=1; j<=11; j++) {
      const cat = randomElement(categories);
      const categoryProducts = properProducts[cat.categoryName] || [`Món ${cat.categoryName} Đặc Biệt`];
      
      // Randomly pick a realistic food name from the matching category
      // Add 'Đặc Biệt' occasionally to distinguish similar items
      const prodName = randomElement(categoryProducts) + (j % 4 === 0 ? ' Đặc Biệt' : '');
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
        unitPrice: unitPrice
      });
    }

    const status = randomInt(1, 10) <= 3 ? 'Pending' : 'Completed';

    // Generate orderDate within peak hours (8 AM - 2 PM) across multiple days
    const daysAgo = randomInt(0, 13); // Orders from today up to 13 days ago
    const hour = randomInt(8, 14);
    const minute = randomInt(0, 59);
    const orderDate = new Date();
    orderDate.setDate(orderDate.getDate() - daysAgo);
    orderDate.setHours(hour, minute, 0, 0);

    const orderData = {
      userId: randomElement(customers).userId,
      storeId: randomElement(stores).storeId,
      totalAmount: totalAmount,
      status: status,
      orderDate: orderDate,
      orderItems: {
        create: orderItemsData
      }
    };

    // Only add feedback for completed orders
    if (status === 'Completed') {
      orderData.orderItems.create = orderItemsData.map(item => ({
        ...item,
        feedback: {
          create: {
            rating: randomInt(4, 5), // Keep ratings generally high!
            comment: randomElement(comments)
          }
        }
      }));
    }

    await prisma.order.create({
      data: orderData
    });

    if (i % 10 === 0) {
      console.log(`... Da tao duoc ${i}/50 don hang (kem theo Feedback)`);
    }
  }

  // ----------------------------------------
  // 7. SEED ANNOUNCEMENTS (~5 announcements)
  // ----------------------------------------
  console.log('Seeding Announcements...');
  
  const announcementData = [
    {
      title: 'Thông báo giờ mở cửa mới',
      content: 'Kể từ ngày 1/5/2025, Canteen IU sẽ mở cửa từ 7:00 AM đến 8:00 PM để phục vụ sinh viên tốt hơn.',
      type: 'all',
      createdBy: managers[0].userId
    },
    {
      title: 'Khuyến mãi đặc biệt cuối tuần',
      content: 'Tất cả các cửa hàng trong Canteen giảm 10% cho đơn hàng trên 100.000đ vào thứ 7 và Chủ nhật.',
      type: 'customers',
      createdBy: managers[1].userId
    },
    {
      title: 'Thông báo cho vendors',
      content: 'Vui lòng cập nhật menu và giá cả trước ngày 25 hàng tháng. Liên hệ bộ phận quản lý nếu cần hỗ trợ.',
      type: 'vendors',
      createdBy: managers[2].userId
    },
    {
      title: 'Cảnh báo an toàn thực phẩm',
      content: 'Mùa hè đến, các cửa hàng lưu ý bảo quản thực phẩm đúng cách để đảm bảo an toàn cho khách hàng.',
      type: 'vendors',
      createdBy: managers[0].userId
    },
    {
      title: 'Chương trình thử thách ăn uống',
      content: 'Tham gia thử thách ăn uống tại Canteen và nhận voucher 50.000đ! Xem chi tiết tại quầy thông tin.',
      type: 'customers',
      createdBy: managers[1].userId
    }
  ];

  for (const ann of announcementData) {
    await prisma.announcement.create({
      data: ann
    });
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