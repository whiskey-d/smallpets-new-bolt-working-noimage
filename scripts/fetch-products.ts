import { connectToDatabase } from '../src/lib/mongodb';
import { searchProducts } from '../src/lib/amazon';
import dotenv from 'dotenv';

dotenv.config();

const categories = [
  { name: 'Food & Treats', keywords: ['small dog food', 'small dog treats'] },
  { name: 'Toys', keywords: ['small dog toys'] },
  { name: 'Beds', keywords: ['small dog bed'] },
  { name: 'Clothing', keywords: ['small dog clothes'] },
  { name: 'Grooming', keywords: ['small dog grooming'] }
];

async function fetchAndStoreProducts() {
  const { db } = await connectToDatabase();
  
  for (const category of categories) {
    for (const keyword of category.keywords) {
      const products = await searchProducts(keyword);
      
      if (products.length > 0) {
        await db.collection('products').insertMany(
          products.map(product => ({
            ...product,
            category: category.name,
            keyword,
            fetchedAt: new Date()
          }))
        );
      }
    }
  }
}

fetchAndStoreProducts()
  .then(() => console.log('Products fetched and stored successfully'))
  .catch(console.error);