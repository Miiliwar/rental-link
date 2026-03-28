/** Demo catalog: 5 items per category for local MVP / UI testing */

export type OwnerType = 'individual' | 'company';

export interface DemoItem {
  id: number;
  title: string;
  category: string;
  image: string;
  price_per_day: number;
  full_item_price: number;
  rating: number;
  reviews: number;
  location: string;
  owner_type: OwnerType;
  timeLeft: string;
}

export const MAIN_CATEGORIES = [
  'Electronics',
  'Clothes',
  'Construction',
  'Agriculture',
  'Student materials',
] as const;

export const MORE_CATEGORIES = [
  'Party & Events',
  'Sports & Outdoors',
  'Vehicles',
  'Furniture',
] as const;

export const ALL_CATEGORIES = [...MAIN_CATEGORIES, ...MORE_CATEGORIES];

export const DEMO_ITEMS: DemoItem[] = [
  // Electronics × 5
  {
    id: 1,
    title: 'Sony A7III Mirrorless Camera',
    category: 'Electronics',
    image:
      'https://images.unsplash.com/photo-1516724562728-afc824a36e84?auto=format&fit=crop&q=80&w=400',
    price_per_day: 45,
    full_item_price: 2000,
    rating: 4.9,
    reviews: 124,
    location: 'Downtown',
    owner_type: 'individual',
    timeLeft: '06:15:48',
  },
  {
    id: 2,
    title: 'DJI Mavic Air 2 Drone',
    category: 'Electronics',
    image:
      'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?auto=format&fit=crop&q=80&w=400',
    price_per_day: 60,
    full_item_price: 1200,
    rating: 4.9,
    reviews: 205,
    location: 'Downtown',
    owner_type: 'company',
    timeLeft: '11:20:00',
  },
  {
    id: 3,
    title: 'MacBook Pro 14" (M3)',
    category: 'Electronics',
    image:
      'https://images.unsplash.com/photo-1517336714731-489689fd45ca?auto=format&fit=crop&q=80&w=400',
    price_per_day: 35,
    full_item_price: 2200,
    rating: 4.8,
    reviews: 88,
    location: 'Tech District',
    owner_type: 'company',
    timeLeft: '04:02:15',
  },
  {
    id: 4,
    title: 'Portable Bluetooth Speaker (JBL)',
    category: 'Electronics',
    image:
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e2?auto=format&fit=crop&q=80&w=400',
    price_per_day: 8,
    full_item_price: 180,
    rating: 4.6,
    reviews: 56,
    location: 'West End',
    owner_type: 'individual',
    timeLeft: '18:45:30',
  },
  {
    id: 5,
    title: '4K OLED Smart TV 55"',
    category: 'Electronics',
    image:
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=400',
    price_per_day: 25,
    full_item_price: 900,
    rating: 4.7,
    reviews: 41,
    location: 'Northside',
    owner_type: 'individual',
    timeLeft: '09:30:00',
  },

  // Clothes × 5
  {
    id: 6,
    title: 'Designer Wedding Suit (Navy)',
    category: 'Clothes',
    image:
      'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&q=80&w=400',
    price_per_day: 35,
    full_item_price: 300,
    rating: 5.0,
    reviews: 42,
    location: 'West End',
    owner_type: 'individual',
    timeLeft: '02:45:12',
  },
  {
    id: 7,
    title: 'Winter Parka (Premium)',
    category: 'Clothes',
    image:
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&q=80&w=400',
    price_per_day: 12,
    full_item_price: 220,
    rating: 4.7,
    reviews: 33,
    location: 'Central',
    owner_type: 'individual',
    timeLeft: '14:00:00',
  },
  {
    id: 8,
    title: 'Evening Dress (Long)',
    category: 'Clothes',
    image:
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=400',
    price_per_day: 28,
    full_item_price: 180,
    rating: 4.6,
    reviews: 19,
    location: 'Uptown',
    owner_type: 'company',
    timeLeft: '07:55:00',
  },
  {
    id: 9,
    title: 'Hiking Boots (Waterproof)',
    category: 'Clothes',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400',
    price_per_day: 6,
    full_item_price: 140,
    rating: 4.5,
    reviews: 67,
    location: 'Trail Hub',
    owner_type: 'individual',
    timeLeft: '20:10:00',
  },
  {
    id: 10,
    title: 'Traditional Outfit Set',
    category: 'Clothes',
    image:
      'https://images.unsplash.com/photo-1550614000-4b9519e02f4a?auto=format&fit=crop&q=80&w=400',
    price_per_day: 45,
    full_item_price: 200,
    rating: 4.8,
    reviews: 12,
    location: 'Culture Quarter',
    owner_type: 'individual',
    timeLeft: '03:12:00',
  },

  // Construction × 5
  {
    id: 11,
    title: 'Makita 18V Cordless Drill',
    category: 'Construction',
    image:
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=400',
    price_per_day: 15,
    full_item_price: 150,
    rating: 4.8,
    reviews: 89,
    location: 'Northside',
    owner_type: 'company',
    timeLeft: '12:30:00',
  },
  {
    id: 12,
    title: 'Circular Saw (Corded)',
    category: 'Construction',
    image:
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=400',
    price_per_day: 12,
    full_item_price: 220,
    rating: 4.7,
    reviews: 54,
    location: 'Industrial Zone',
    owner_type: 'individual',
    timeLeft: '05:22:00',
  },
  {
    id: 13,
    title: 'Extension Ladder (24 ft)',
    category: 'Construction',
    image:
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=400',
    price_per_day: 18,
    full_item_price: 280,
    rating: 4.6,
    reviews: 31,
    location: 'East Yard',
    owner_type: 'company',
    timeLeft: '16:40:00',
  },
  {
    id: 14,
    title: 'Portable Cement Mixer',
    category: 'Construction',
    image:
      'https://images.unsplash.com/photo-1504307651254-35680f356f12?auto=format&fit=crop&q=80&w=400',
    price_per_day: 45,
    full_item_price: 650,
    rating: 4.5,
    reviews: 22,
    location: 'Southside',
    owner_type: 'company',
    timeLeft: '08:05:00',
  },
  {
    id: 15,
    title: 'Laser Level Kit',
    category: 'Construction',
    image:
      'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=400',
    price_per_day: 10,
    full_item_price: 190,
    rating: 4.8,
    reviews: 47,
    location: 'Northside',
    owner_type: 'individual',
    timeLeft: '22:10:05',
  },

  // Agriculture × 5
  {
    id: 16,
    title: 'Heavy Duty Tiller / Cultivator',
    category: 'Agriculture',
    image:
      'https://images.unsplash.com/photo-1592982537447-6f233425b956?auto=format&fit=crop&q=80&w=400',
    price_per_day: 80,
    full_item_price: 800,
    rating: 4.7,
    reviews: 15,
    location: 'Rural Area',
    owner_type: 'company',
    timeLeft: '08:20:00',
  },
  {
    id: 17,
    title: 'Gas Chainsaw (18")',
    category: 'Agriculture',
    image:
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=400',
    price_per_day: 22,
    full_item_price: 320,
    rating: 4.6,
    reviews: 28,
    location: 'Green Valley',
    owner_type: 'individual',
    timeLeft: '13:00:00',
  },
  {
    id: 18,
    title: 'Water Pump (Electric)',
    category: 'Agriculture',
    image:
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=400',
    price_per_day: 14,
    full_item_price: 240,
    rating: 4.8,
    reviews: 19,
    location: 'Farm Road',
    owner_type: 'individual',
    timeLeft: '10:15:00',
  },
  {
    id: 19,
    title: 'Backpack Sprayer (16L)',
    category: 'Agriculture',
    image:
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=400',
    price_per_day: 7,
    full_item_price: 90,
    rating: 4.4,
    reviews: 36,
    location: 'Orchard Lane',
    owner_type: 'individual',
    timeLeft: '19:00:00',
  },
  {
    id: 20,
    title: 'Garden Utility Trailer',
    category: 'Agriculture',
    image:
      'https://images.unsplash.com/photo-1592982537447-6f233425b956?auto=format&fit=crop&q=80&w=400',
    price_per_day: 35,
    full_item_price: 450,
    rating: 4.5,
    reviews: 11,
    location: 'Rural Area',
    owner_type: 'company',
    timeLeft: '06:50:00',
  },

  // Student materials × 5
  {
    id: 21,
    title: 'Medical Anatomy Bundle',
    category: 'Student materials',
    image:
      'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=400',
    price_per_day: 5,
    full_item_price: 120,
    rating: 4.6,
    reviews: 92,
    location: 'University District',
    owner_type: 'individual',
    timeLeft: '22:10:05',
  },
  {
    id: 22,
    title: 'TI-84 Plus CE Calculator',
    category: 'Student materials',
    image:
      'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&q=80&w=400',
    price_per_day: 3,
    full_item_price: 120,
    rating: 4.9,
    reviews: 210,
    location: 'Campus North',
    owner_type: 'individual',
    timeLeft: '01:00:00',
  },
  {
    id: 23,
    title: 'STEM Textbook Set (Semester)',
    category: 'Student materials',
    image:
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=400',
    price_per_day: 4,
    full_item_price: 80,
    rating: 4.5,
    reviews: 64,
    location: 'Library Row',
    owner_type: 'individual',
    timeLeft: '15:30:00',
  },
  {
    id: 24,
    title: 'Desk Lamp + Laptop Stand',
    category: 'Student materials',
    image:
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=400',
    price_per_day: 4,
    full_item_price: 95,
    rating: 4.3,
    reviews: 41,
    location: 'Student Village',
    owner_type: 'company',
    timeLeft: '12:00:00',
  },
  {
    id: 25,
    title: 'A2 Drawing Board + Parallel Bar',
    category: 'Student materials',
    image:
      'https://images.unsplash.com/photo-1456731158627-239baa32d7ed?auto=format&fit=crop&q=80&w=400',
    price_per_day: 6,
    full_item_price: 140,
    rating: 4.7,
    reviews: 18,
    location: 'Arts Block',
    owner_type: 'individual',
    timeLeft: '09:45:00',
  },

  // Party & Events × 5
  {
    id: 26,
    title: 'PA Speaker System (Pair)',
    category: 'Party & Events',
    image:
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=400',
    price_per_day: 45,
    full_item_price: 800,
    rating: 4.8,
    reviews: 37,
    location: 'Event Hall',
    owner_type: 'company',
    timeLeft: '05:00:00',
  },
  {
    id: 27,
    title: 'LED Party Lights Pack',
    category: 'Party & Events',
    image:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=400',
    price_per_day: 15,
    full_item_price: 150,
    rating: 4.6,
    reviews: 52,
    location: 'Downtown',
    owner_type: 'individual',
    timeLeft: '11:11:00',
  },
  {
    id: 28,
    title: 'Folding Tables + Chairs (20)',
    category: 'Party & Events',
    image:
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=400',
    price_per_day: 55,
    full_item_price: 600,
    rating: 4.5,
    reviews: 24,
    location: 'Community Center',
    owner_type: 'company',
    timeLeft: '17:25:00',
  },
  {
    id: 29,
    title: '120" Projector Screen',
    category: 'Party & Events',
    image:
      'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=400',
    price_per_day: 20,
    full_item_price: 240,
    rating: 4.7,
    reviews: 16,
    location: 'Cinema Quarter',
    owner_type: 'individual',
    timeLeft: '08:08:00',
  },
  {
    id: 30,
    title: 'Fog Machine + Remote',
    category: 'Party & Events',
    image:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=400',
    price_per_day: 18,
    full_item_price: 200,
    rating: 4.4,
    reviews: 29,
    location: 'Downtown',
    owner_type: 'individual',
    timeLeft: '21:00:00',
  },

  // Sports & Outdoors × 5
  {
    id: 31,
    title: 'Mountain Bike (Large)',
    category: 'Sports & Outdoors',
    image:
      'https://images.unsplash.com/photo-1485965120183-e176fadc2798?auto=format&fit=crop&q=80&w=400',
    price_per_day: 22,
    full_item_price: 650,
    rating: 4.8,
    reviews: 71,
    location: 'Trail Hub',
    owner_type: 'individual',
    timeLeft: '06:06:00',
  },
  {
    id: 32,
    title: '4-Person Camping Tent',
    category: 'Sports & Outdoors',
    image:
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=400',
    price_per_day: 18,
    full_item_price: 280,
    rating: 4.6,
    reviews: 44,
    location: 'Lake Park',
    owner_type: 'individual',
    timeLeft: '14:14:00',
  },
  {
    id: 33,
    title: 'Inflatable Kayak (2P)',
    category: 'Sports & Outdoors',
    image:
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=400',
    price_per_day: 30,
    full_item_price: 420,
    rating: 4.7,
    reviews: 33,
    location: 'Riverfront',
    owner_type: 'company',
    timeLeft: '10:10:00',
  },
  {
    id: 34,
    title: 'Golf Club Set (Full)',
    category: 'Sports & Outdoors',
    image:
      'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80&w=400',
    price_per_day: 40,
    full_item_price: 900,
    rating: 4.9,
    reviews: 27,
    location: 'Golf Club',
    owner_type: 'individual',
    timeLeft: '07:40:00',
  },
  {
    id: 35,
    title: 'Tennis Racket Pair + Balls',
    category: 'Sports & Outdoors',
    image:
      'https://images.unsplash.com/photo-1622279457426-7cf7b7e0b6d0?auto=format&fit=crop&q=80&w=400',
    price_per_day: 9,
    full_item_price: 140,
    rating: 4.5,
    reviews: 58,
    location: 'Sports Complex',
    owner_type: 'individual',
    timeLeft: '13:13:00',
  },

  // Vehicles × 5
  {
    id: 36,
    title: 'E-Bike (City)',
    category: 'Vehicles',
    image:
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&q=80&w=400',
    price_per_day: 25,
    full_item_price: 1800,
    rating: 4.8,
    reviews: 102,
    location: 'Bike Hub',
    owner_type: 'company',
    timeLeft: '04:44:00',
  },
  {
    id: 37,
    title: 'Electric Scooter (Foldable)',
    category: 'Vehicles',
    image:
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&q=80&w=400',
    price_per_day: 12,
    full_item_price: 450,
    rating: 4.6,
    reviews: 156,
    location: 'Downtown',
    owner_type: 'individual',
    timeLeft: '18:18:00',
  },
  {
    id: 38,
    title: 'Cargo Trailer (Small)',
    category: 'Vehicles',
    image:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=400',
    price_per_day: 35,
    full_item_price: 900,
    rating: 4.5,
    reviews: 21,
    location: 'Logistics Hub',
    owner_type: 'company',
    timeLeft: '09:09:00',
  },
  {
    id: 39,
    title: 'Child Bike Trailer',
    category: 'Vehicles',
    image:
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&q=80&w=400',
    price_per_day: 10,
    full_item_price: 220,
    rating: 4.7,
    reviews: 34,
    location: 'Family Park',
    owner_type: 'individual',
    timeLeft: '15:15:00',
  },
  {
    id: 40,
    title: 'Roof Cargo Box (XL)',
    category: 'Vehicles',
    image:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=400',
    price_per_day: 15,
    full_item_price: 380,
    rating: 4.5,
    reviews: 17,
    location: 'Auto Zone',
    owner_type: 'company',
    timeLeft: '20:20:00',
  },

  // Furniture × 5
  {
    id: 41,
    title: 'Ergonomic Office Chair',
    category: 'Furniture',
    image:
      'https://images.unsplash.com/photo-1580480055274-7bb9d6f4e7b2?auto=format&fit=crop&q=80&w=400',
    price_per_day: 8,
    full_item_price: 320,
    rating: 4.6,
    reviews: 91,
    location: 'Business Park',
    owner_type: 'individual',
    timeLeft: '12:12:00',
  },
  {
    id: 42,
    title: 'Sofa Bed (3-Seater)',
    category: 'Furniture',
    image:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400',
    price_per_day: 22,
    full_item_price: 650,
    rating: 4.8,
    reviews: 48,
    location: 'Suburbs',
    owner_type: 'company',
    timeLeft: '03:03:00',
  },
  {
    id: 43,
    title: 'Bookshelf (5-Tier)',
    category: 'Furniture',
    image:
      'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&q=80&w=400',
    price_per_day: 6,
    full_item_price: 140,
    rating: 4.4,
    reviews: 26,
    location: 'University District',
    owner_type: 'individual',
    timeLeft: '16:16:00',
  },
  {
    id: 44,
    title: 'Dining Table + 4 Chairs',
    category: 'Furniture',
    image:
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80&w=400',
    price_per_day: 30,
    full_item_price: 520,
    rating: 4.7,
    reviews: 22,
    location: 'Central',
    owner_type: 'individual',
    timeLeft: '11:11:00',
  },
  {
    id: 45,
    title: 'Standing Desk (Electric)',
    category: 'Furniture',
    image:
      'https://images.unsplash.com/photo-1595515106969-1ce58366e345?auto=format&fit=crop&q=80&w=400',
    price_per_day: 14,
    full_item_price: 480,
    rating: 4.6,
    reviews: 39,
    location: 'Tech District',
    owner_type: 'company',
    timeLeft: '08:08:00',
  },
];

export function getItemsByCategory(category: string): DemoItem[] {
  return DEMO_ITEMS.filter((item) => item.category === category);
}

export function getDemoItemById(id: number): DemoItem | undefined {
  return DEMO_ITEMS.find((item) => item.id === id);
}
