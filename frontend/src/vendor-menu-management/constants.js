// Shared constants used across vendor-menu-management components

export const CATEGORIES = ['Food', 'Drink', 'Snack', 'Dessert'];

export const EMPTY_FORM = { name: '', type: '', price: '', desc: '', image: '' };

export const SEED_ITEMS = [
  { id: 1, type: 'Food',  name: 'Bún bò Huế',          desc: 'Tasty lunch for everyone',          price: 35000, available: true,  image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&h=300&fit=crop' },
  { id: 2, type: 'Food',  name: 'Bún bò Huế',          desc: 'Tasty lunch for everyone',          price: 35000, available: true,  image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&h=300&fit=crop' },
  { id: 3, type: 'Food',  name: 'Bún bò Huế',          desc: 'Tasty lunch for everyone',          price: 35000, available: false, image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&h=300&fit=crop' },
  { id: 4, type: 'Food',  name: 'Bún bò Huế',          desc: 'Tasty lunch for everyone',          price: 35000, available: true,  image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&h=300&fit=crop' },
  { id: 5, type: 'Food',  name: 'Cơm Sườn Trứng',      desc: 'Classic Vietnamese rice plate',     price: 40000, available: true,  image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&h=300&fit=crop' },
  { id: 6, type: 'Drink', name: 'Nước Chanh Muối',     desc: 'Refreshing salty lemonade',         price: 18000, available: true,  image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&h=300&fit=crop' },
  { id: 7, type: 'Food',  name: 'Bánh Mì Thịt Nướng',  desc: 'Grilled pork Vietnamese baguette', price: 25000, available: true,  image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=300&fit=crop' },
  { id: 8, type: 'Drink', name: 'Trà Sữa Trân Châu',   desc: 'Creamy bubble milk tea',            price: 29000, available: true,  image: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=600&h=300&fit=crop' },
];

export const formatVND = (amount) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
