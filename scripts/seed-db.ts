import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { categories } from '../src/lib/categories';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('product_database');
    
    // Clear existing data
    await db.collection('products').deleteMany({});
    
    // Sample products for each category
    const products = [];
    
    for (const [categorySlug, category] of Object.entries(categories)) {
      for (const subcategory of category.subcategories) {
        // Add 4-6 products per subcategory
        const numProducts = Math.floor(Math.random() * 3) + 4;
        
        for (let i = 0; i < numProducts; i++) {
          const price = Math.floor(Math.random() * 80) + 20;
          const rating = (Math.random() * 2) + 3; // Rating between 3-5
          const reviewCount = Math.floor(Math.random() * 500) + 50;
          
          products.push({
            title: `${subcategory.name} Product ${i + 1}`,
            description: `High-quality ${subcategory.name.toLowerCase()} for small dogs. ${subcategory.description}`,
            price,
            image: 'https://placehold.co/300x300/F9A826/ffffff/png',
            category: category.title,
            subcategory: subcategory.name,
            rating,
            reviewCount,
            affiliateUrl: `https://amazon.com/dp/B${Math.random().toString(36).substr(2, 9)}`,
            featured: Math.random() < 0.2, // 20% chance of being featured
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      }
    }
    
    // Insert products
    await db.collection('products').insertMany(products);
    console.log(`Inserted ${products.length} products`);
    
    // Create indexes
    await db.collection('products').createIndex({ category: 1 });
    await db.collection('products').createIndex({ subcategory: 1 });
    await db.collection('products').createIndex({ price: 1 });
    await db.collection('products').createIndex({ rating: -1 });
    await db.collection('products').createIndex({ featured: 1 });
    
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
  }
}

seedDatabase();