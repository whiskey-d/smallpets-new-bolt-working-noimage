import { generateFullCatalog } from './generateProducts';
import type { Product } from './types';

export const products: Product[] = generateFullCatalog();

export function getProducts() {
  return products;
}

export function getProduct(id: string) {
  return products.find(p => p._id === id);
}

export function getProductsByCategory(category: string) {
  return products.filter(p => p.category.toLowerCase() === category.toLowerCase());
}

export function getProductsBySubcategory(category: string, subcategory: string) {
  return products.filter(p => 
    p.category.toLowerCase() === category.toLowerCase() &&
    p.subcategory?.toLowerCase() === subcategory.toLowerCase()
  );
}