import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useProduct } from '../hooks/useProduct';
import { useNavigate } from 'react-router';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const products = useSelector((state) => state.product.products || []);
  const loading = useSelector((state) => state.product.loading);

  const { handleGetAllProducts } = useProduct();

  const navigate = useNavigate();

  useEffect(() => {
    handleGetAllProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return products;

    return products.filter((product) =>
      product.title?.toLowerCase().includes(term)
    );
  }, [products, searchTerm]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center justify-between lg:justify-start">
            <a href="/" className="text-xl font-semibold tracking-[0.3em] text-slate-900">
              SNITCH
            </a>
          </div>

          <label className="w-full lg:max-w-xl lg:flex-1 lg:px-6">
            <span className="sr-only">Search products</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search products"
              className="w-full rounded-full border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
            />
          </label>

          <div className="hidden items-center gap-3 text-sm text-slate-600 lg:flex">
            <span className="rounded-full bg-slate-100 px-3 py-1.5">Fresh picks</span>
            <span className="rounded-full bg-slate-100 px-3 py-1.5">New arrivals</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <section className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-slate-500">
              Discover the edit
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Modern essentials for your everyday style
            </h1>
          </div>
          <p className="max-w-xl text-sm text-slate-600 sm:text-base">
            Curated pieces, sharp silhouettes, and everyday comfort built for the modern wardrobe.
          </p>
        </section>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="h-48 bg-slate-200" />
                <div className="space-y-3 p-4">
                  <div className="h-4 w-3/4 rounded bg-slate-200" />
                  <div className="h-3 w-full rounded bg-slate-200" />
                  <div className="h-3 w-2/3 rounded bg-slate-200" />
                  <div className="h-9 rounded-full bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex min-h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-slate-800">No products found</h2>
            <p className="mt-2 max-w-md text-sm text-slate-600">
              Try a different keyword or check back soon for fresh arrivals.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => {
              const fallbackImage = 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80';
              const firstImage = product.images?.[0];
              const image =
                (typeof firstImage === 'string' && firstImage) ||
                firstImage?.url ||
                firstImage?.secure_url ||
                fallbackImage;
              const price = product.price?.amount ?? 0;
              const currency = product.price?.currency || 'INR';

              return (
                <article
                  onClick={() => navigate(`/products/${product._id}`)}
                  key={product._id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="overflow-hidden">
                    <img
                      src={image}
                      alt={product.title}
                      onError={(event) => {
                        event.currentTarget.src = fallbackImage;
                      }}
                      className="h-48 w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="flex flex-col gap-3 p-4">
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">{product.title}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                        {product.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-base font-semibold text-slate-900">
                        {currency} {price.toLocaleString('en-IN')}
                      </p>
                    </div>

                    <button className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-900 hover:bg-slate-900 hover:text-white">
                      View Product
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
