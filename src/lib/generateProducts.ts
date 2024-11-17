import { Product } from './types';

// Helper function to generate a random price within a range
function randomPrice(min: number, max: number): number {
  return Number((Math.random() * (max - min) + min).toFixed(2));
}

// Helper function to generate a random rating between 3.5 and 5.0
function randomRating(): number {
  return Number((Math.random() * 1.5 + 3.5).toFixed(1));
}

// Helper function to generate a random number of reviews
function randomReviews(): number {
  return Math.floor(Math.random() * 150000) + 1000;
}

// Generate products for a specific subcategory
export function generateProductsForSubcategory(
  category: string,
  subcategory: string,
  count: number,
  startId: number
): Product[] {
  const products: Product[] = [];
  
  // Product templates for each subcategory
  const templates: Record<string, {
    titles: string[];
    priceRange: { min: number; max: number };
    imagePrefix: string;
  }> = {
    'beds': {
      titles: [
        'Orthopedic Dog Bed',
        'Calming Donut Bed',
        'Elevated Cooling Bed',
        'Memory Foam Dog Mattress',
        'Cozy Cave Dog Bed',
        'Plush Sofa-Style Bed'
      ],
      priceRange: { min: 24.99, max: 89.99 },
      imagePrefix: 'bed'
    },
    'mats': {
      titles: [
        'Non-Slip Mat',
        'Cooling Mat',
        'Training Mat',
        'Memory Foam Mat',
        'Waterproof Mat'
      ],
      priceRange: { min: 14.99, max: 39.99 },
      imagePrefix: 'mat'
    },
    'blankets': {
      titles: [
        'Fleece Blanket',
        'Sherpa Throw',
        'Waterproof Blanket',
        'Plush Blanket',
        'Microfiber Throw'
      ],
      priceRange: { min: 12.99, max: 34.99 },
      imagePrefix: 'blanket'
    },
    'interactive toys': {
      titles: [
        'Puzzle Toy',
        'Treat Dispenser',
        'Interactive Ball',
        'Hide and Seek Toy',
        'Electronic Toy'
      ],
      priceRange: { min: 9.99, max: 29.99 },
      imagePrefix: 'toy'
    },
    'plush toys': {
      titles: [
        'Squeaky Plush',
        'Stuffed Animal',
        'Rope Toy',
        'Crinkle Toy',
        'Plush Ball'
      ],
      priceRange: { min: 4.99, max: 19.99 },
      imagePrefix: 'plush'
    },
    'chew toys': {
      titles: [
        'Durable Chew',
        'Dental Chew Toy',
        'Teething Toy',
        'Nylon Bone',
        'Natural Rubber Toy'
      ],
      priceRange: { min: 6.99, max: 24.99 },
      imagePrefix: 'chew'
    },
    'brushes': {
      titles: [
        'Self-Cleaning Slicker Brush',
        'Double-Sided Pin Brush',
        'Deshedding Tool',
        'Grooming Rake',
        'Soft Bristle Brush',
        'Dematting Comb'
      ],
      priceRange: { min: 9.99, max: 34.99 },
      imagePrefix: 'brush'
    },
    'shampoos': {
      titles: [
        'Gentle Puppy Shampoo',
        'Moisturizing Shampoo',
        'Medicated Shampoo',
        'Detangling Shampoo',
        'Natural Shampoo'
      ],
      priceRange: { min: 8.99, max: 24.99 },
      imagePrefix: 'shampoo'
    }
  };

  // Get template or use default
  const template = templates[subcategory.toLowerCase()] || {
    titles: [`${subcategory} Product`],
    priceRange: { min: 9.99, max: 49.99 },
    imagePrefix: 'default'
  };

  for (let i = 0; i < count; i++) {
    const id = (startId + i).toString();
    const titleBase = template.titles[i % template.titles.length];
    const variant = Math.floor(i / template.titles.length) + 1;
    const color = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    
    products.push({
      _id: id,
      title: `Premium ${titleBase} - Style ${variant}`,
      description: `High-quality ${subcategory.toLowerCase()} product for small dogs. Perfect for daily use and comfort.`,
      price: randomPrice(template.priceRange.min, template.priceRange.max),
      image: `https://placehold.co/600x600/${color}/ffffff/png?text=${encodeURIComponent(titleBase)}`,
      rating: randomRating(),
      reviewCount: randomReviews(),
      category: category,
      subcategory: subcategory,
      affiliateUrl: `https://www.amazon.com/dp/B${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  return products;
}

// Generate a full catalog of products
export function generateFullCatalog(): Product[] {
  let allProducts: Product[] = [];
  let currentId = 1;

  const categories = {
    'Beds & Furniture': ['Beds', 'Mats', 'Blankets'],
    'Toys & Entertainment': ['Interactive Toys', 'Plush Toys', 'Chew Toys'],
    'Grooming & Care': ['Brushes', 'Shampoos', 'Nail Care'],
    'Clothing & Accessories': ['Sweaters', 'Rainwear', 'Accessories'],
    'Training & Behavior': ['Training Tools', 'Treats', 'Behavior Aids'],
    'Health & Wellness': ['Supplements', 'First Aid', 'Dental Care']
  };

  // Generate 240 products for each subcategory (10 pages of 24 products)
  Object.entries(categories).forEach(([category, subcategories]) => {
    subcategories.forEach(subcategory => {
      const products = generateProductsForSubcategory(category, subcategory, 240, currentId);
      allProducts = [...allProducts, ...products];
      currentId += 240;
    });
  });

  return allProducts;
}