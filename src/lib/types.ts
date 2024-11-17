export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  subcategory?: string;
  rating: number;
  reviewCount: number;
  affiliateUrl: string;
  featured?: boolean;
  specs?: {
    [key: string]: string | number | boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationData {
  total: number;
  pages: number;
  page: number;
  limit: number;
}