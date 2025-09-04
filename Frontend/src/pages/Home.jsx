import { useEffect, useMemo, useState } from 'react';
import './Home.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

// UI only: sample products similar shape to seller endpoint
const sampleProducts = [
  {
    _id: 'p1',
    title: 'test_product',
    description: 'test_description',
    price: { amount: 999, currency: 'INR' },
    images: ['https://ik.imagekit.io/hnoglyswo0/kodr_phase_1/faac7bd7-de98-41c6-81ee-1662f17e7ac5_p8DgQjfuxw'],
    stock: 20
  },
  {
    _id: 'p2',
    title: 'Minimal Backpack',
    description: 'Durable & water resistant everyday carry.',
    price: { amount: 4599, currency: 'INR' },
    images: ['https://images.unsplash.com/photo-1514474959185-1472d4d4b221?auto=format&fit=crop&w=600&q=60'],
    stock: 4
  },
  {
    _id: 'p3',
    title: 'Ceramic Mug',
    description: 'Hand glazed stoneware mug 350ml.',
    price: { amount: 1299, currency: 'INR' },
    images: ['https://images.unsplash.com/photo-1556909114-6d2a7926f397?auto=format&fit=crop&w=600&q=60'],
    stock: 0
  },
  {
    _id: 'p4',
    title: 'Wireless Earbuds',
    description: 'Noise isolating Bluetooth 5.3 earbuds.',
    price: { amount: 8999, currency: 'INR' },
    images: ['https://images.unsplash.com/photo-1585386959984-a4155222cd05?auto=format&fit=crop&w=600&q=60'],
    stock: 37
  }
];

export default function Home() {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('newest');
  const [allProducts, setAllProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/api/auth');
        console.log('API Response:', response.data);
        console.log('Products array:', response.data.products);
        setAllProducts(response.data);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setError(error.message);
        // Fallback to sample data for development
        setAllProducts({ products: sampleProducts });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // In real implementation, fetch products & set state.
  const products = allProducts?.products;

  const filtered = useMemo(() => {
    if (!products || !Array.isArray(products)) return [];

    const q = query.trim().toLowerCase();

    let list = products.filter(
      (p) =>
        !q ||
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
    );

    switch (sort) {
      case 'price-asc':
        list = [...list].sort((a, b) => {
          const priceA = a.price?.amount || 0;
          const priceB = b.price?.amount || 0;
          return priceA - priceB;
        });
        break;
      case 'price-desc':
        list = [...list].sort((a, b) => {
          const priceA = a.price?.amount || 0;
          const priceB = b.price?.amount || 0;
          return priceB - priceA;
        });
        break;
      case 'stock':
        list = [...list].sort((a, b) => (b.stock || 0) - (a.stock || 0));
        break;
      default:
        // "newest" - if you have a createdAt or id, sort by that
        list = [...list].sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
          const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
          return dateB - dateA;
        });
        break;
    }
    return list;
  }, [products, query, sort]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error && (!products || products.length === 0)) {
    return (
      <div className="error-state">
        <h2>Unable to load products</h2>
        <p>Error: {error}</p>
        <p>Please check your API connection.</p>
      </div>
    );
  }

  return (
    <div className="home-shell" aria-labelledby="home-heading">
      <section className="home-hero">
        <h1 id="home-heading" className="home-title">Discover products</h1>
        <p className="home-sub">
          Browse a curated selection of items.
          {error && " (Using sample data due to API error)"}
        </p>
      </section>

      <div className="products-toolbar">
        <div className="filters" role="search">
          <input
            type="search"
            placeholder="Search products..."
            aria-label="Search products"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <select aria-label="Sort products" value={sort} onChange={e => setSort(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="stock">Stock</option>
          </select>
        </div>
        <div style={{ fontSize: '.65rem', color: 'var(--color-text-soft)' }} aria-live="polite">
          {filtered.length} products
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty" role="status">
          <strong>No products</strong>
          Try adjusting your search or filters.
        </div>
      ) : (
        <div className="products-grid" role="list" aria-label="Products">
          {filtered.map(p => {
            if (!p || !p._id) return null; // Skip invalid products

            const cover = p.images?.[0];

            // Safe price handling with fallbacks
            const price = p.price || { amount: 0, currency: 'INR' };
            const amount = price.amount || 0;
            const currency = price.currency || 'INR';

            const priceFmt = new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: currency
            }).format(amount / 100);

            const stock = p.stock || 0;
            const low = stock < 5;

            return (
              <Link
                to={`/product/${p._id}`}
                key={p._id}
                className="p-card"
                role="listitem"
                aria-label={p.title || 'Product'}
              >
                {cover ? (
                  <img
                    src={cover}
                    alt={p.title || 'Product'}
                    className="p-thumb"
                    loading="lazy"
                  />
                ) : (
                  <div className="p-thumb" aria-hidden="true" />
                )}
                <div className="p-body">
                  <h3 className="p-title" title={p.title}>
                    {p.title || 'Untitled Product'}
                  </h3>
                  <p className="p-desc" title={p.description}>
                    {p.description || 'No description available'}
                  </p>
                  <div className="p-price-row">
                    <span className="p-price">{priceFmt}</span>
                    <span className={`p-stock ${low ? 'low' : ''}`}>
                      {stock > 0 ? `${stock} in stock` : 'Out of stock'}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}