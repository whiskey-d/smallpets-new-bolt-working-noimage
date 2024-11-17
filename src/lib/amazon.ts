import amazon from 'amazon-product-api';
import dotenv from 'dotenv';

dotenv.config();

const client = amazon.createClient({
  awsId: process.env.AMAZON_ACCESS_KEY!,
  awsSecret: process.env.AMAZON_SECRET_KEY!,
  awsTag: process.env.AMAZON_PARTNER_TAG!
});

export async function searchAmazonProducts(params: {
  keywords: string;
  searchIndex?: string;
  minPrice?: number;
  maxPrice?: number;
  minReviews?: number;
  minRating?: number;
  itemCount?: number;
}) {
  const {
    keywords,
    searchIndex = 'PetSupplies',
    minPrice,
    maxPrice,
    minReviews = 50,
    minRating = 4,
    itemCount = 10
  } = params;

  try {
    const results = await client.itemSearch({
      keywords,
      searchIndex,
      responseGroup: 'ItemAttributes,Images,Reviews,Offers',
      domain: 'com',
      itemPage: 1,
      sort: 'salesrank'
    });

    // Filter and transform results
    return results
      .filter((item: any) => {
        const reviews = parseInt(item.TotalReviews?.[0] || '0');
        const rating = parseFloat(item.AverageRating?.[0] || '0');
        const price = parseFloat(item.Price?.[0].Amount?.[0] || '0') / 100;

        return (
          reviews >= minReviews &&
          rating >= minRating &&
          (!minPrice || price >= minPrice) &&
          (!maxPrice || price <= maxPrice)
        );
      })
      .slice(0, itemCount)
      .map((item: any) => ({
        _id: item.ASIN[0],
        title: item.Title[0],
        description: item.Feature?.join(' ') || '',
        price: parseFloat(item.Price?.[0].Amount?.[0] || '0') / 100,
        image: item.LargeImage?.[0].URL?.[0],
        rating: parseFloat(item.AverageRating?.[0] || '0'),
        reviewCount: parseInt(item.TotalReviews?.[0] || '0'),
        affiliateUrl: item.DetailPageURL[0],
        features: item.Feature || [],
        brand: item.Brand?.[0],
        availability: item.Availability?.[0],
        createdAt: new Date(),
        updatedAt: new Date()
      }));
  } catch (error) {
    console.error('Amazon API Error:', error);
    return [];
  }
}