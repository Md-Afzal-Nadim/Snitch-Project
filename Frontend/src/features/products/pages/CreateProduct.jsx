import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useProduct } from '../hooks/useProduct';

const INITIAL_FORM = {
  title: '',
  description: '',
  priceAmount: '',
  priceCurrency: 'INR',
};

const currencyOptions = ['INR', 'USD', 'EUR', 'GBP'];

const CreateProduct = () => {
  const navigate = useNavigate();
  const { handleCreateProduct } = useProduct();

  const [form, setForm] = useState(INITIAL_FORM);
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const previewUrlsRef = useRef([]);

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, []);

  const uploadCountLabel = useMemo(() => `${images.length}/7 uploaded`, [images.length]);

  const validateForm = (values) => {
    const nextErrors = {};

    if (!values.title.trim()) {
      nextErrors.title = 'A product title is required.';
    } else if (values.title.trim().length < 3) {
      nextErrors.title = 'Title should be at least 3 characters.';
    }

    if (!values.description.trim()) {
      nextErrors.description = 'Add a short product description.';
    } else if (values.description.trim().length < 20) {
      nextErrors.description = 'Description should be at least 20 characters.';
    }

    if (!values.priceAmount) {
      nextErrors.priceAmount = 'Enter a valid price.';
    } else if (Number(values.priceAmount) <= 0) {
      nextErrors.priceAmount = 'Price must be greater than 0.';
    }

    if (!values.priceCurrency) {
      nextErrors.priceCurrency = 'Choose a currency.';
    }

    if (images.length === 0) {
      nextErrors.images = 'Upload at least one product image.';
    }

    return nextErrors;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const processFiles = (fileList) => {
    const incomingFiles = Array.from(fileList || []);

    if (incomingFiles.length === 0) {
      return;
    }

    const remainingSlots = 7 - images.length;
    const filesToAdd = incomingFiles.slice(0, remainingSlots);

    if (filesToAdd.length === 0) {
      setErrors((prev) => ({ ...prev, images: 'You can upload up to 7 images.' }));
      return;
    }

    const newImages = filesToAdd.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    previewUrlsRef.current = [...previewUrlsRef.current, ...newImages.map((image) => image.preview)];
    setImages((prev) => [...prev, ...newImages]);
    setErrors((prev) => ({ ...prev, images: '' }));
    setSubmitMessage('');
  };

  const handleFileChange = (event) => {
    processFiles(event.target.files);
    event.target.value = '';
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    processFiles(event.dataTransfer.files);
  };

  const removeImage = (indexToRemove) => {
    setImages((prev) => {
      const next = prev.filter((_, index) => index !== indexToRemove);
      const removed = prev[indexToRemove];
      if (removed?.preview) {
        previewUrlsRef.current = previewUrlsRef.current.filter((preview) => preview !== removed.preview);
        URL.revokeObjectURL(removed.preview);
      }
      return next;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const payload = new FormData();
      payload.append('title', form.title.trim());
      payload.append('description', form.description.trim());
      payload.append('priceAmount', form.priceAmount);
      payload.append('priceCurrency', form.priceCurrency);

      images.forEach((image) => {
        payload.append('images', image.file);
      });

      await handleCreateProduct(payload);
      
      setSubmitMessage('Product saved successfully.');
      setForm(INITIAL_FORM);
      setImages([]);
    } catch (error) {
      setSubmitMessage(error?.response?.data?.message || 'Unable to save the product right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 px-4 py-8 text-stone-800 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 rounded-[28px] border border-stone-200/70 bg-white p-4 shadow-[0_20px_60px_-24px_rgba(41,37,36,0.35)] sm:p-6 lg:p-8">
        <div className="flex flex-col gap-3 border-b border-stone-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-500">Snitch Studio</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">Create a new product</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
              Build a polished product listing with rich visuals, pricing, and a seamless publishing flow.
            </p>
          </div>
          <div className="rounded-full border border-stone-200 bg-stone-100 px-4 py-2 text-sm font-medium text-stone-700">
            {uploadCountLabel}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5">
            <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-4 sm:p-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label htmlFor="title" className="mb-2 block text-sm font-medium text-stone-700">
                    Product Title
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={form.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Oversized Wool Coat"
                    className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none transition focus:ring-2 ${errors.title ? 'border-rose-400 focus:ring-rose-200' : 'border-stone-200 focus:ring-stone-300'}`}
                  />
                  {errors.title ? <p className="mt-2 text-sm text-rose-600">{errors.title}</p> : null}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="description" className="mb-2 block text-sm font-medium text-stone-700">
                    Product Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleInputChange}
                    rows="5"
                    placeholder="Describe the fit, material, and styling details."
                    className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none transition focus:ring-2 ${errors.description ? 'border-rose-400 focus:ring-rose-200' : 'border-stone-200 focus:ring-stone-300'}`}
                  />
                  {errors.description ? <p className="mt-2 text-sm text-rose-600">{errors.description}</p> : null}
                </div>

                <div>
                  <label htmlFor="priceAmount" className="mb-2 block text-sm font-medium text-stone-700">
                    Price Amount
                  </label>
                  <input
                    id="priceAmount"
                    name="priceAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.priceAmount}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none transition focus:ring-2 ${errors.priceAmount ? 'border-rose-400 focus:ring-rose-200' : 'border-stone-200 focus:ring-stone-300'}`}
                  />
                  {errors.priceAmount ? <p className="mt-2 text-sm text-rose-600">{errors.priceAmount}</p> : null}
                </div>

                <div>
                  <label htmlFor="priceCurrency" className="mb-2 block text-sm font-medium text-stone-700">
                    Price Currency
                  </label>
                  <select
                    id="priceCurrency"
                    name="priceCurrency"
                    value={form.priceCurrency}
                    onChange={handleInputChange}
                    className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none transition focus:ring-2 ${errors.priceCurrency ? 'border-rose-400 focus:ring-rose-200' : 'border-stone-200 focus:ring-stone-300'}`}
                  >
                    {currencyOptions.map((currency) => (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </select>
                  {errors.priceCurrency ? <p className="mt-2 text-sm text-rose-600">{errors.priceCurrency}</p> : null}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
              <div>
                <h2 className="text-base font-semibold text-stone-900">Ready to publish?</h2>
                <p className="text-sm text-stone-600">Your product will appear with a polished, premium listing.</p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setForm(INITIAL_FORM);
                    setImages([]);
                    setErrors({});
                    setSubmitMessage('');
                    navigate('/');
                  }}
                  className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-400"
                >
                  {isSubmitting ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`rounded-3xl border-2 border-dashed p-4 transition sm:p-5 ${isDragging ? 'border-stone-500 bg-stone-100' : 'border-stone-300 bg-stone-50/60'}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-stone-900">Product Images</h2>
                  <p className="mt-1 text-sm text-stone-600">Upload up to 7 high-quality visuals.</p>
                </div>
                <span className="rounded-full bg-stone-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                  {uploadCountLabel}
                </span>
              </div>

              <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-stone-200 bg-white px-4 py-8 text-center transition hover:border-stone-400 hover:bg-stone-100">
                <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-900 text-xl text-white">
                  +
                </div>
                <p className="mt-3 text-sm font-semibold text-stone-800">Drop images here or browse</p>
                <p className="mt-1 text-sm text-stone-500">PNG, JPG, or WEBP files</p>
              </label>

              {errors.images ? <p className="mt-3 text-sm text-rose-600">{errors.images}</p> : null}
            </div>

            {images.length > 0 ? (
              <div className="rounded-3xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-stone-900">Image Preview</h3>
                  <p className="text-sm text-stone-500">Tap an image to remove it</p>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {images.map((image, index) => (
                    <div key={`${image.preview}-${index}`} className="group relative overflow-hidden rounded-2xl border border-stone-200 bg-stone-50">
                      <img src={image.preview} alt={`Preview ${index + 1}`} className="h-24 w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute right-2 top-2 rounded-full bg-stone-900/80 px-2 py-1 text-xs font-semibold text-white transition hover:bg-stone-900"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-stone-200 bg-stone-50/60 p-5 text-sm text-stone-500">
                Image previews will appear here after upload.
              </div>
            )}

            {submitMessage ? (
              <div className={`rounded-2xl border p-4 text-sm ${submitMessage.includes('successfully') ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-amber-200 bg-amber-50 text-amber-700'}`}>
                {submitMessage}
              </div>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
