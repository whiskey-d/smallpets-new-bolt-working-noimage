import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { categories } from '../src/lib/categories';
import { searchAmazonProducts } from '../src/lib/amazon';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

async function fetchAndStoreProducts() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('product_database');
    
    // Clear existing products
    await db.collection('products').deleteMany({});
    
    // Fetch products for each category and subcategory
    for (const [categorySlug, category] of Object.entries(categories)) {
      console.log(`Processing category: ${category.title}`);
      
      for (const subcategory of category.subcategories) {
        console.log(`  Processing subcategory: ${subcategory.name}`);
        
        // Construct search keywords
        const keywords = `small dog ${subcategory.name.toLowerCase()}`;
        
        // Fetch products from Amazon
        const products = await searchAmazonProducts({
          keywords,
          itemCount: 60,
          minReviews: 50,
          minRating: 4
        });
        
        if (products.length > 0) {
          // Add category and subcategory info
          const productsWithCategories = products.map(product => ({
            ...product,
            category: category.title,
            subcategory: subcategory.name,
            categorySlug,
            subcategorySlug: subcategory.slug
          }));
          
          // Store in database
          await db.collection('products').insertMany(productsWithCategories);
          console.log(`    Added ${products.length} products`);
        } else {
          console.log('    No products found');
        }
        
        // Wait to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // Create indexes
    await db.collection('products').createIndex({ category: 1 });
    await db.collection('products').createIndex({ subcategory: 1 });
    await db.collection('products').createIndex({ categorySlug: 1 });
    await db.collection('products').createIndex({ subcategorySlug: 1 });
    await db.collection('products').createIndex({ price: 1 });
    await db.collection('products').createIndex({ rating: -1 });
    await db.collection('products').createIndex({ reviewCount: -1 });
    
    console.log('Finished fetching and storing products');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

fetchAndStoreProducts();