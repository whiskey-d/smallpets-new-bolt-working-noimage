import type { APIRoute } from 'astro';
import { products } from '../../lib/products';

export const GET: APIRoute = async ({ url }) => {
  try {
    const category = url.searchParams.get('category');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '12');
    
    let filteredProducts = products;
    if (category) {
      filteredProducts = products.filter(p => 
        p.category.toLowerCase() === category.toLowerCase()
      );
    }

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedProducts = filteredProducts.slice(start, end);

    return new Response(JSON.stringify({
      products: paginatedProducts,
      pagination: {
        total: filteredProducts.length,
        pages: Math.ceil(filteredProducts.length / limit),
        page,
        limit
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('API Error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch products',
        message: 'Please try again later'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}