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
    <div className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

       

       
        

        

        {/* All Collections */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base lg:text-xl font-bold text-slate-900">All Collections</h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-xl overflow-hidden bg-slate-100">
                  <div className="h-44 lg:h-56 bg-slate-200" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 w-2/3 bg-slate-200 rounded" />
                    <div className="h-3 w-1/2 bg-slate-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
              <h2 className="text-base font-semibold text-slate-800">No products found</h2>
              <p className="mt-1 text-sm text-slate-500">Try a different keyword or check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filteredProducts.map((product) => {
                const fallbackImage = 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&q=80';
                const firstImage = product.images?.[0];
                const image =
                  (typeof firstImage === 'string' && firstImage) ||
                  firstImage?.url ||
                  firstImage?.secure_url ||
                  fallbackImage;
                const price = product.price?.amount ?? 0;
                const currency = product.price?.currency || 'INR';
                const symbol = currency === 'INR' ? '₹' : currency;
                const mrp = product.price?.mrp ?? Math.round(price * 1.6);
                const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : null;
                const rating = product.rating ?? (4.2 + Math.random() * 0.6).toFixed(1);
                const reviews = product.reviewCount ?? Math.floor(Math.random() * 4000 + 500);

                return (
                  <article
                    key={product._id}
                    onClick={() => navigate(`/products/${product._id}`)}
                    className="overflow-hidden rounded-xl bg-white border border-slate-100 shadow-sm cursor-pointer hover:-translate-y-1 hover:shadow-md active:scale-95 transition-all duration-200"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={image}
                        alt={product.title}
                        onError={(e) => { e.currentTarget.src = fallbackImage; }}
                        className="h-44 lg:h-60 w-full object-cover"
                      />
                      {/* Rating badge */}
                      <div className="absolute top-2 left-2 flex items-center gap-1 rounded bg-white/90 px-1.5 py-0.5 shadow-sm">
                        <span className="text-[10px] font-bold text-slate-800">{rating} ★</span>
                        <span className="text-[9px] text-slate-500">| {(reviews / 1000).toFixed(1)}k</span>
                      </div>
                      {/* Wishlist */}
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="absolute bottom-2 right-2 h-7 w-7 lg:h-8 lg:w-8 rounded-full bg-white shadow flex items-center justify-center hover:text-rose-500 transition-colors"
                      >
                        <span className="text-sm text-slate-400">♡</span>
                      </button>
                    </div>

                    <div className="p-2.5 lg:p-3">
                      <p className="text-[10px] font-semibold uppercase text-slate-500 tracking-wide truncate">
                        {product.brand || 'SNITCH'}
                      </p>
                      <h3 className="text-xs lg:text-sm font-semibold text-slate-900 leading-snug line-clamp-2 mt-0.5">
                        {product.title}
                      </h3>

                    {/* Description add kiya */}
                    <p className="mt-1 line-clamp-2 text-xs text-slate-500 leading-relaxed">
                     {product.description}
                     </p>    



                      <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                        <span className="text-sm lg:text-base font-bold text-slate-900">
                          {symbol}{price.toLocaleString('en-IN')}
                        </span>
                        {mrp > price && (
                          <>
                            <span className="text-xs text-slate-400 line-through">
                              {symbol}{mrp.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] font-bold text-green-600">({discount}% OFF)</span>
                          </>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        
      </div>
    </div>
  );
};


export default Home;