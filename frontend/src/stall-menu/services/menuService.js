const createDishImage = (title, accent) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${accent}" />
          <stop offset="100%" stop-color="#111827" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#bg)" rx="40" />
      <circle cx="610" cy="150" r="96" fill="rgba(255,255,255,0.12)" />
      <circle cx="168" cy="468" r="130" fill="rgba(255,255,255,0.1)" />
      <text x="70" y="460" fill="#ffffff" font-size="64" font-family="Arial, sans-serif" font-weight="700">${title}</text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const mockMenu = {
  categories: ["All", "Burgers", "Meals", "Drinks", "Desserts"],
  stallInfo: {
    name: "Big U",
    tagline: "I'm lovin' it!",
    minimumOrder: "Minimum Order: 12 GBP",
    deliveryTime: "Delivery in 20-25 Minutes",
    openHours: "08:00 A.M. - 14:00 P.M.",
    rating: "3.4",
    reviews: "1,360 reviews",
  },
  offers: [
    {
      id: "offer-1",
      title: "First Order Discount",
      label: "Big U / East London",
      discount: "-20%",
      image: createDishImage("First Order", "#4f46e5"),
    },
    {
      id: "offer-2",
      title: "Vegan Discount",
      label: "Big U / East London",
      discount: "-20%",
      image: createDishImage("Vegan Deal", "#0891b2"),
    },
    {
      id: "offer-3",
      title: "Free Ice Cream Offer",
      label: "Big U / East London",
      discount: "-100%",
      image: createDishImage("Ice Cream", "#f59e0b"),
    },
  ],
  products: [
    {
      id: 1,
      name: "Royal Cheese Burger with extra Fries",
      category: "Burgers",
      description: "1 McChicken, 1 Big Mac, 1 Royal Cheeseburger, 3 medium fries.",
      details: ["1 McChicken", "1 Big Mac", "1 Royal Cheeseburger", "3 medium fries"],
      price: 79000,
      currency: "VND",
      soldCount: 20,
      prepTime: 8,
      isAvailable: true,
      isFeatured: true,
      image: createDishImage("Cheese Burger", "#f97316"),
    },
    {
      id: 2,
      name: "The classics for 3",
      category: "Burgers",
      description: "1 McChicken, 1 Big Mac, 1 Royal Cheeseburger, 3 medium fries, 3 cold drinks.",
      details: ["1 McChicken", "1 Big Mac", "1 Royal Cheeseburger", "3 medium fries"],
      price: 99000,
      currency: "VND",
      soldCount: 14,
      prepTime: 10,
      isAvailable: true,
      isFeatured: false,
      image: createDishImage("Classics for 3", "#fbbf24"),
    },
    {
      id: 3,
      name: "Family Burger Box",
      category: "Burgers",
      description: "Double burger set with signature sides and refreshing drinks.",
      details: ["2 double burgers", "2 signature fries", "2 house drinks"],
      price: 129000,
      currency: "VND",
      soldCount: 32,
      prepTime: 9,
      isAvailable: true,
      isFeatured: true,
      image: createDishImage("Burger Box", "#fb7185"),
    },
    {
      id: 4,
      name: "Chicken Wrap Combo",
      category: "Meals",
      description: "Crispy chicken wrap paired with seasoned wedges and a soft drink.",
      details: ["1 chicken wrap", "1 wedges", "1 soft drink"],
      price: 89000,
      currency: "VND",
      soldCount: 17,
      prepTime: 11,
      isAvailable: true,
      isFeatured: false,
      image: createDishImage("Wrap Combo", "#14b8a6"),
    },
    {
      id: 5,
      name: "Signature Cola Float",
      category: "Drinks",
      description: "Chilled cola served with vanilla soft cream for a sweet finish.",
      details: ["Large cola", "Vanilla soft cream topping"],
      price: 35000,
      currency: "VND",
      soldCount: 9,
      prepTime: 3,
      isAvailable: true,
      isFeatured: false,
      image: createDishImage("Cola Float", "#0f172a"),
    },
    {
      id: 6,
      name: "Caramel Sundae",
      category: "Desserts",
      description: "Swirls of soft serve with caramel sauce and biscuit crunch.",
      details: ["Soft serve", "Caramel sauce", "Biscuit crunch"],
      price: 29000,
      currency: "VND",
      soldCount: 27,
      prepTime: 4,
      isAvailable: true,
      isFeatured: true,
      image: createDishImage("Sundae", "#8b5cf6"),
    },
    {
      id: 7,
      name: "Mocha Frappe",
      category: "Drinks",
      description: "Blended coffee drink with chocolate drizzle and whipped topping.",
      details: ["Espresso", "Milk", "Chocolate drizzle"],
      price: 45000,
      currency: "VND",
      soldCount: 11,
      prepTime: 6,
      isAvailable: true,
      isFeatured: false,
      image: createDishImage("Mocha Frappe", "#7c2d12"),
    },
    {
      id: 8,
      name: "Mini Donut Box",
      category: "Desserts",
      description: "A warm mini donut box with cinnamon sugar and chocolate dip.",
      details: ["6 mini donuts", "Chocolate dip", "Cinnamon sugar"],
      price: 39000,
      currency: "VND",
      soldCount: 16,
      prepTime: 5,
      isAvailable: true,
      isFeatured: false,
      image: createDishImage("Donut Box", "#ec4899"),
    },
  ],
};

export const getMenuByStall = async (stall) =>
  Promise.resolve({
    ...mockMenu,
    categories: mockMenu.categories.filter(Boolean),
    stallName: stall?.name || "Campus stall",
    stallInfo: {
      ...mockMenu.stallInfo,
      name: stall?.name || mockMenu.stallInfo.name,
    },
  });
