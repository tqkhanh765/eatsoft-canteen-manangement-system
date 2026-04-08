async function seedCategories(prisma) {
  console.log('Seeding Categories...');
  const categories = [];
  const categoryNames = [
    'Drinks', 'Fast Food', 'Rice', 'Noodles', 'Desserts', 
    'Vegan', 'Snacks', 'Soups', 'Salads', 'Seafood', 
    'BBQ', 'Breakfast', 'Bakery', 'Coffee', 'Healthy'
  ];

  for (const name of categoryNames) {
    const category = await prisma.category.create({
      data: { CategoryName: name },
    });
    categories.push(category);
  }
  
  console.log('Created 15 Categories.');
  return categories;
}

module.exports = seedCategories;