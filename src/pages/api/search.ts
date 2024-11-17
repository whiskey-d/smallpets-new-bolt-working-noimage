import type { APIRoute } from 'astro';
import { products } from '../../lib/products';

export const GET: APIRoute = async ({ url }) => {
  try {
    const query = url.searchParams.get('q') || '';
    
    const searchResults = products.filter(product => 
      product.title.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 10);

    return new Response(JSON.stringify({ products: searchResults }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Search failed' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}