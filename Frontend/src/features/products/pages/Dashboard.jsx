import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { useProduct } from '../hooks/useProduct';

const Dashboard = () => {
  const navigate = useNavigate();
  const { handleGetSellerProducts } = useProduct();
  const sellerProducts = useSelector((state) => state.product.sellerProducts || []);

  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const result = await handleGetSellerProducts();
        if (isMounted) {
          setProducts(result || []);
        }
      } catch (error) {
        if (isMounted) {
          setProducts([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return products;
    }

    return products.filter((product) =>
      product.title?.toLowerCase().includes(query)
    );
  }, [products, searchTerm]);

  const formatPrice = (price) => {
    if (!price) {
      return 'Price not available';
    }

    const currencySymbol = price.currency === 'USD' ? '$' : price.currency === 'EUR' ? '€' : '₹';
    return `${currencySymbol}${Number(price.amount || 0).toLocaleString('en-IN')}`;
  };

  const formatDate = (date) => {
    if (!date) {
      return 'Recently added';
    }

    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleDelete = (productId) => {
    setProducts((currentProducts) => currentProducts.filter((product) => product._id !== productId));
  };

  return (
    <div className="min-h-screen bg-stone-50 px-4 py-8 text-stone-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-4xl border border-stone-200/70 bg-white p-4 shadow-[0_20px_70px_-28px_rgba(28,25,23,0.34)] sm:p-6 lg:p-8">
        <div className="flex flex-col gap-5 border-b border-stone-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-stone-500">Snitch Seller Hub</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
              Seller Dashboard
            </h1>
            <p className="mt-3 text-sm leading-6 text-stone-600 sm:text-base">
              Manage your product catalog with a clean, modern workspace designed for fast updates and confident selling.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-full border border-stone-200 bg-stone-100 px-4 py-2 text-sm font-medium text-stone-700">
              {sellerProducts.length} total products
            </div>
            <button
              type="button"
              onClick={() => navigate('/seller/create-product')}
              className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-700"
            >
              Create Product
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <label className="w-full lg:max-w-md">
            <span className="sr-only">Search products</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by title"
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700 outline-none transition focus:border-stone-400 focus:bg-white"
            />
          </label>

          <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-600">
            Showing {filteredProducts.length} product{filteredProducts.length === 1 ? '' : 's'}
          </div>
        </div>

        {isLoading ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="animate-pulse rounded-3xl border border-stone-200 bg-stone-50 p-4">
                <div className="h-44 rounded-2xl bg-stone-200" />
                <div className="mt-4 space-y-3">
                  <div className="h-4 w-2/3 rounded bg-stone-200" />
                  <div className="h-3 w-full rounded bg-stone-200" />
                  <div className="h-3 w-5/6 rounded bg-stone-200" />
                  <div className="h-10 rounded-2xl bg-stone-200" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="mt-10 flex flex-col items-center justify-center rounded-[28px] border border-dashed border-stone-300 bg-stone-50/80 px-6 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
              <svg viewBox="0 0 24 24" className="h-8 w-8 text-stone-500" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v3.25a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 10.75V7.5Z" />
                <path d="M8 13.5V19" />
                <path d="M16 13.5V19" />
                <path d="M4 10.75h16" />
              </svg>
            </div>
            <h2 className="mt-5 text-xl font-semibold text-stone-900">No products found.</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-stone-600">
              No products found. Create your first product.
            </p>
            <button
              type="button"
              onClick={() => navigate('/seller/create-product')}
              className="mt-6 rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-700"
            >
              Create your first product
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => {
              const firstImage = product.images?.[0]?.url;

              return (
                <article
                onClick={() => {navigate(`/seller/products/${product._id}`) }}
                  key={product._id}
                  className="group overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-56 overflow-hidden bg-stone-100">
                    {firstImage ? (
                      <img
                        src={firstImage}
                        alt={product.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-linear-to-br from-stone-200 via-stone-100 to-stone-200 text-sm font-medium text-stone-600">
                        No image yet
                      </div>
                    )}
                    <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-stone-600">
                      {product.images?.length || 0} image{(product.images?.length || 0) === 1 ? '' : 's'}
                    </div>
                  </div>

                  <div className="space-y-4 p-5">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-lg font-semibold text-stone-900">{product.title}</h3>
                        <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-600">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                      <p className="line-clamp-2 text-sm leading-6 text-stone-600">
                        {product.description || 'A polished product listing ready to impress shoppers.'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-sm text-stone-500">
                      <span>Created {formatDate(product.createdAt)}</span>
                      <span className="font-medium text-stone-700">{product.images?.length || 0} photos</span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => navigate('/seller/create-product')}
                        className="flex-1 rounded-2xl border border-stone-200 bg-white px-3 py-2 text-sm font-semibold text-stone-700 transition hover:border-stone-300 hover:bg-stone-50"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(product._id)}
                        className="flex-1 rounded-2xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
