import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useProduct } from '../hooks/useProduct';

const getNormalizedImages = (productData) => {
  const imageList = Array.isArray(productData?.images) ? productData.images : [];

  return imageList
    .map((image) => (typeof image === 'string' ? image : image?.url || image?.secure_url || ''))
    .filter(Boolean);
};

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [loading, setLoading] = useState(true);

  const { handleGetProductById } = useProduct();

  useEffect(() => {
    let isMounted = true;

    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const data = await handleGetProductById(productId);

        if (isMounted) {
          setProduct(data || null);
          const images = getNormalizedImages(data);
          setSelectedImage(images[0] || '');
        }
      } catch (error) {
        if (isMounted) {
          setProduct(null);
          setSelectedImage('');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProductDetails();

    return () => {
      isMounted = false;
    };
  }, [productId]);

  const images = getNormalizedImages(product);
  const currency = product?.price?.currency || 'INR';
  const price = product?.price?.amount ?? 0;
  const createdDate = product?.createdAt
    ? new Date(product.createdAt).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
    : 'Not available';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {loading ? (
          <div className="grid gap-8 rounded-4xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:grid-cols-[1.05fr_0.95fr] lg:p-8">
            <div className="space-y-4">
              <div className="h-105 animate-pulse rounded-3xl bg-slate-200 sm:h-130" />
              <div className="flex gap-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="h-20 w-20 animate-pulse rounded-2xl bg-slate-200" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-6 w-24 animate-pulse rounded-full bg-slate-200" />
              <div className="h-10 w-3/4 animate-pulse rounded-full bg-slate-200" />
              <div className="h-24 animate-pulse rounded-2xl bg-slate-200" />
              <div className="h-20 animate-pulse rounded-2xl bg-slate-200" />
            </div>
          </div>
        ) : !product ? (
          <div className="rounded-4xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Product not found</h2>
            <p className="mt-2 text-sm text-slate-600">The product you are looking for is unavailable right now.</p>
          </div>
        ) : (
          <div className="grid gap-8 rounded-4xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:grid-cols-[1.05fr_0.95fr] lg:p-8">
            <div className="space-y-4">
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt={product.title}
                    className="h-105 w-full object-cover sm:h-130"
                  />
                ) : (
                  <div className="flex h-105 items-center justify-center bg-slate-100 text-sm font-medium text-slate-500 sm:h-130">
                    No image available
                  </div>
                )}
              </div>

              {images.length > 1 ? (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {images.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setSelectedImage(image)}
                      className={`h-20 w-20 shrink-0 overflow-hidden rounded-2xl border transition ${selectedImage === image
                          ? 'border-slate-900 ring-2 ring-slate-200'
                          : 'border-slate-200 hover:border-slate-400'
                        }`}
                    >
                      <img src={image} alt={`${product.title} thumbnail ${index + 1}`} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-500">Premium drop</p>
                  <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{product.title}</h1>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700">
                    {currency} {Number(price).toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm text-slate-500">Free shipping over ₹2,000</span>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Description</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-700">
                    {product.description || 'A polished product listing ready to impress shoppers.'}
                  </p>
                </div>

                <dl className="grid gap-3 rounded-2xl border border-slate-200 p-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-slate-500">Product ID</dt>
                    <dd className="mt-1 text-sm font-semibold text-slate-800">{product._id || '—'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-slate-500">Created</dt>
                    <dd className="mt-1 text-sm font-semibold text-slate-800">{createdDate}</dd>
                  </div>
                </dl>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button className="flex-1 rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:bg-slate-900 hover:text-white">
                  Add to Cart
                </button>
                <button className="flex-1 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
