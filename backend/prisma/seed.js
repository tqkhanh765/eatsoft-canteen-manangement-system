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
  await prisma.announcementVendor.deleteMany();
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

  // Image mapping - Add your actual image URLs here
  // Format: 'Product Name': 'URL or local path'
  // For local images: '/images/filename.jpg'
  // For external images: 'https://your-cloudinary-url.com/image.jpg'
  const productImages = {
    // Cơm (Rice dishes)
    'Cơm Chiên Dương Châu': '/images/Chinese fried rice.png',
    'Cơm Tấm Sườn Bì': '/images/broken rice with grilled pork.png',
    'Cơm Gà Xối Mỡ': '/images/Ginger braised chicken with rice.png',
    'Cơm Chiên Hải Sản': '/images/Shrimp and crab fried rice.png',
    'Cơm Ba Rọi Xào Sả Ớt': '/images/Vietnamese mixed rice with stir-fried beef.png',
    'Cơm Thập Cẩm': '/images/Yangzhou fried rice with shrimp.png',
    'Cơm Thập Cẩm Đặc Biệt': '/images/Teriyaki chicken and fried rice.png',
    'Cơm Chiên Dương Châu Đặc Biệt': '/images/Hoi An-style shredded chicken fried rice.png',
    'Cơm Tấm Sườn Bì Đặc Biệt': '/images/broken rice with honey grilled chicken.png',
    'Cơm Gà Xối Mỡ Đặc Biệt': '/images/fried rice with chicken and fried egg.png',
    'Cơm Chiên Hải Sản Đặc Biệt': '/images/Kimchi beef fried rice.png',

    // Phở/Bún (Noodle dishes)
    'Phở Bò Tái Nạm': '/images/Vietnamese iced coffee.png',
    'Bún Bò Huế': '/images/Bun Bo Hue.png',
    'Bún Thịt Nướng': '/images/dry noodles with grilled chicken.png',
    'Bún Chả Hà Nội': '/images/char siu dry noodles.png',
    'Phở Gà': '/images/chicken rice with black bean sauce.png',
    'Bún Mọc': '/images/Wonton noodle soup with char siu.png',
    'Phở Bò Tái Nạm Đặc Biệt': '/images/Vietnamese iced milk coffee.png',
    'Bún Bò Huế Đặc Biệt': '/images/crab and snail noodle soup.png',
    'Bún Thịt Nướng Đặc Biệt': '/images/shredded chicken noodles.png',

    // Món Nước (Soup dishes)
    'Hủ Tiếu Nam Vang': '/images/Hu Tieu Nam Vang.png',
    'Mì Quảng': '/images/chicken banh canh.png',
    'Bánh Canh Cua': '/images/banh canh.png',
    'Mì Hoành Thánh': '/images/Chicken glass noodle soup bowl.png',
    'Súp Cua': '/images/Vietnamese chicken stew.png',
    'Nui Nước Xương': '/images/seafood udon.png',
    'Hủ Tiếu Nam Vang Đặc Biệt': '/images/Wonton noodle soup.png',
    'Mì Quảng Đặc Biệt': '/images/crispy chicken cheese noodles.png',

    // Bánh Mì (Banh mi)
    'Bánh Mì Ốp La': '/images/fried sausage.png',
    'Bánh Mì Chả Lụa': '/images/Spaghetti with sausage and fried egg.png',
    'Bánh Mì Thịt Nướng': '/images/grilled chicken salad.png',
    'Bánh Mì Xíu Mại': '/images/mixed salad.png',
    'Bánh Mì Heo Quay': '/images/Korean fried chicken with seaweed rice.png',
    'Bánh Mì Bò Né': '/images/fried chicken with cheese sauce.png',

    // Xiên Que (Skewers)
    'Cá Viên Chiên': '/images/Korean mixed rice.png',
    'Xúc Xích Chiên': '/images/fried rice with oyster sauce.png',
    'Hồ Lô Nướng': '/images/garlic fried rice.png',
    'Bò Viên': '/images/fried rice with chicken and teriyaki sauce.png',
    'Phô Mai Que': '/images/Thai-style fried rice with eggs.png',
    'Cá Viên Cà Ri': '/images/Braised basa fish with rice.png',

    // Cà Phê (Coffee)
    'Cà Phê Đen Đá': '/images/iced black coffee.png',
    'Cà Phê Sữa Đá': '/images/Vietnamese iced coffee.png',
    'Bạc Xỉu': '/images/bac xiu.png',
    'Cà Phê Muối': '/images/salted cafe.png',
    'Capuchino': '/images/cappucino.png',
    'Latte': '/images/espresso.png',
    'Cà Phê Sữa Đá Đặc Biệt': '/images/Vietnamese iced milk coffee.png',
    'Cà Phê Muối Đặc Biệt': '/images/salted coffee.png',

    // Trà Sữa (Milk tea)
    'Trà Sữa Trân Châu': '/images/Iced bubble tea.png',
    'Trà Sữa Thái Xanh': '/images/mango matcha latte.png',
    'Trà Sữa Matcha': '/images/Iced matcha latte.png',
    'Hồng Trà Sữa': '/images/Iced oolong milk tea.png',
    'Trà Sữa Khoai Môn': '/images/black tea with tapioca pearls.png',
    'Trà Sữa Đường Đen': '/images/bubble milk tea.png',
    'Trà Sữa Trân Châu Đặc Biệt': '/images/Iced matcha latte with oat milk.png',
    'Trà Sữa Matcha Đặc Biệt': '/images/matcha iced blender.png',

    // Sinh Tố (Smoothies)
    'Sinh Tố Bơ': '/images/avocado smoothie.png',
    'Sinh Tố Dâu': '/images/strawberry smoothie.png',
    'Sinh Tố Xoài': '/images/Mango iced tea.png',
    'Sinh Tố Mãng Cầu': '/images/Sapodilla smoothie.png',
    'Sinh Tố Dưa Hấu': '/images/strawberry yogurt.png',
    'Nước Ép Táo': '/images/orange juice.png',
    'Sinh Tố Mãng Cầu Đặc Biệt': '/images/strawberry sugarcane juice.png',
    'Sinh Tố Dưa Hấu Đặc Biệt': '/images/orange+carrot juice.png',

    // Nước Ngọt (Soft drinks)
    'Coca Cola': '/images/cookie blender.png',
    'Pepsi': '/images/jelly cocoa drink.png',
    'Sprite': '/images/iced milk cocoa.png',
    '7Up': '/images/coconut milk coffee ice blended.png',
    'Mirinda': '/images/hibicus kombuca.png',
    'Sting': '/images/grapefruit coldbrew.png',

    // Trà Trái Cây (Fruit tea)
    'Trà Đào Cam Sả': '/images/honey lemon tea.png',
    'Trà Vải': '/images/peach tea.png',
    'Trà Dâu': '/images/strawberry smoothie.png',
    'Trà Tắc': '/images/blueberry tea.png',
    'Trà Ổi Hồng': '/images/Pomegranate cold brew.png',
    'Lục Trà Chanh': '/images/Mango iced tea.png',
    'Trà Đào Cam Sả Đặc Biệt': '/images/matcha ice blended.png',

    // Đồ Chay (Vegetarian)
    'Cơm Chay': '/images/mixed stir-fried noodles.png',
    'Bún Xào Chay': '/images/noodles with beef stir fry.png',
    'Đậu Hũ Tứ Xuyên Chay': '/images/stir-fried beef noodles.png',
    'Gỏi Cuốn Chay': '/images/udon noodles with tonkatsu.png',
    'Canh Chua Chay': '/images/katsu curry.png',
    'Mì Căn Xào Sả Ớt': '/images/Jajangmyeon.png',

    // Tráng Miệng (Desserts)
    'Bánh Flan': '/images/cookie blender.png',
    'Rau Câu Sơn Thủy': '/images/jelly cocoa drink.png',
    'Sữa Chua Trân Châu': '/images/strawberry yogurt.png',
    'Chè Dưỡng Nhan': '/images/avocado smoothie.png',
    'Chè Thái': '/images/Sapodilla smoothie.png',
    'Bánh Mousse': '/images/mango matcha latte.png',

    // Gà Rán (Fried chicken)
    'Gà Rán Phần M': '/images/Korean fried chicken with seaweed rice.png',
    'Gà Rán Cay': '/images/fried chicken with cheese sauce.png',
    'Cánh Gà Sốt Tương': '/images/chicken rice with black bean sauce.png',
    'Gà Viên Chiên': '/images/Korean mixed rice.png',
    'Đùi Gà Rán': '/images/Teriyaki chicken and fried rice.png',
    'Gà Sốt Phô Mai': '/images/crispy chicken cheese noodles.png',

    // Pizza/Mỳ Ý (Pizza/Pasta)
    'Pizza Hải Sản': '/images/Shrimp and crab fried rice.png',
    'Pizza Xúc Xích': '/images/Spaghetti with sausage and fried egg.png',
    'Mỳ Ý Hải Sản': '/images/seafood udon.png',
    'Mỳ Ý Bò Băm': '/images/Vietnamese mixed rice with stir-fried beef.png',
    'Pizza Phô Mai': '/images/crispy chicken cheese noodles.png',
    'Mỳ Ý Carbonara': '/images/udon noodles with tonkatsu.png',

    // Đồ Ăn Vặt Hàn Quốc (Korean snacks)
    'Tteokbokki': '/images/Jajangmyeon.png',
    'Kimbap': '/images/Korean mixed rice.png',
    'Chả Cá Xiên': '/images/Bulgogi.png',
    'Mì Cay Bò': '/images/Korean fried chicken with seaweed rice.png',
    'Tteokbokki Phô Mai': '/images/katsu curry.png',
    'Mì Trộn Tương Đen': '/images/Jajangmyeon.png',
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
      
      // Try to get image from mapping, otherwise use placeholder
      const imageURL = productImages[prodName] || 'https://placehold.co/200x200/png';
      
      const p = await prisma.product.create({
        data: {
          storeId: store.storeId,
          categoryId: cat.categoryId,
          name: prodName,
          price: priceVal,
          isAvailable: true,
          imageURL: imageURL
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
    // Pick a random store for this order first
    const orderStore = randomElement(stores);
    const storeProducts = products.filter(p => p.storeId === orderStore.storeId);
    
    const orderItemsData = [];
    let totalAmount = 0;
    
    // We create exactly 6 items per order, all from the same store
    for(let k=0; k<6; k++) {
      const product = randomElement(storeProducts);
      const qty = randomInt(1, 3);
      const unitPrice = Number(product.price);
      totalAmount += unitPrice * qty;

      orderItemsData.push({
        productId: product.productId,
        quantity: qty,
        unitPrice: unitPrice
      });
    }

    const status = 'COMPLETED';

    // Generate orderDate within peak hours (8 AM - 2 PM) across multiple days
    const daysAgo = randomInt(0, 13); // Orders from today up to 13 days ago
    const hour = randomInt(8, 14);
    const minute = randomInt(0, 59);
    const orderDate = new Date();
    orderDate.setDate(orderDate.getDate() - daysAgo);
    orderDate.setHours(hour, minute, 0, 0);

    const orderData = {
      userId: randomElement(customers).userId,
      storeId: orderStore.storeId,
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

  // Calculate soldCount for each product from order items
  console.log('Calculating soldCount for products...');
  const orderItems = await prisma.orderItem.findMany();
  const productSoldCounts = {};

  orderItems.forEach(item => {
    const productId = item.productId;
    if (productSoldCounts[productId]) {
      productSoldCounts[productId] += item.quantity;
    } else {
      productSoldCounts[productId] = item.quantity;
    }
  });

  // Update each product with its soldCount
  for (const [productId, soldCount] of Object.entries(productSoldCounts)) {
    await prisma.product.update({
      where: { productId: Number(productId) },
      data: { soldCount }
    });
  }
  console.log('✅ SoldCount calculated and updated for all products');

  // ----------------------------------------
  // 7. SEED ANNOUNCEMENTS (~5 announcements)
  // ----------------------------------------
  console.log('Seeding Announcements...');
  
  const announcementData = [
    {
      title: 'Thông báo giờ mở cửa mới',
      content: 'Kể từ ngày 1/5/2025, Canteen IU sẽ mở cửa từ 7:00 AM đến 8:00 PM để phục vụ sinh viên tốt hơn.',
      type: 'all',
      createdBy: managers[0].userId,
      vendorIds: [] // No specific vendors for 'all' type
    },
    {
      title: 'Khuyến mãi đặc biệt cuối tuần',
      content: 'Tất cả các cửa hàng trong Canteen giảm 10% cho đơn hàng trên 100.000đ vào thứ 7 và Chủ nhật.',
      type: 'customers',
      createdBy: managers[1].userId,
      vendorIds: [] // No specific vendors for 'customers' type
    },
    {
      title: 'Thông báo cho vendors',
      content: 'Vui lòng cập nhật menu và giá cả trước ngày 25 hàng tháng. Liên hệ bộ phận quản lý nếu cần hỗ trợ.',
      type: 'vendors',
      createdBy: managers[2].userId,
      vendorIds: vendors.slice(0, 2).map(v => v.userId) // Send to first 2 vendors
    },
    {
      title: 'Cảnh báo an toàn thực phẩm',
      content: 'Mùa hè đến, các cửa hàng lưu ý bảo quản thực phẩm đúng cách để đảm bảo an toàn cho khách hàng.',
      type: 'vendors',
      createdBy: managers[0].userId,
      vendorIds: vendors.slice(2, 4).map(v => v.userId) // Send to next 2 vendors
    },
    {
      title: 'Chương trình thử thách ăn uống',
      content: 'Tham gia thử thách ăn uống tại Canteen và nhận voucher 50.000đ! Xem chi tiết tại quầy thông tin.',
      type: 'customers',
      createdBy: managers[1].userId,
      vendorIds: [] // No specific vendors for 'customers' type
    }
  ];

  for (const ann of announcementData) {
    const createdAnn = await prisma.announcement.create({
      data: {
        title: ann.title,
        content: ann.content,
        type: ann.type,
        createdBy: ann.createdBy,
        vendors: ann.vendorIds.length > 0 ? {
          create: ann.vendorIds.map(vendorId => ({
            vendorId: vendorId
          }))
        } : undefined
      }
    });
    console.log(`  - Created announcement: "${createdAnn.title}" for ${ann.type}${ann.vendorIds.length > 0 ? ` (${ann.vendorIds.length} vendors)` : ''}`);
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