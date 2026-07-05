import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { useProduct } from '../hooks/useProduct';
import { useCart } from '../../cart/hooks/useCart';

const ProductDetail = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('Description');
    const navigate = useNavigate();
    const { handleGetProductById } = useProduct();
    const { handleAddItem } = useCart();

    async function fetchProductDetails() {
        try {
            const data = await handleGetProductById(productId);
            setProduct(data?.product || data);
        } catch (error) {
            console.error("Failed to fetch product details", error);
        }
    }

    useEffect(() => {
        fetchProductDetails();
    }, [productId]);

    useEffect(() => {
        if (product?.variants?.length > 0) {
            setSelectedAttributes(product.variants[0].attributes || {});
        } else if (!product?.variants || product.variants.length === 0) {
            // Dummy Attributes Fallback if product has no variants/sizes
            setSelectedAttributes({ 'Size': 'L', 'Color': 'Black' });
        }
    }, [product]);

    const activeVariant = useMemo(() => {
        if (!product?.variants || product.variants.length === 0) return null;
        return product.variants.find(v => {
            if (!v.attributes) return false;
            const vKeys = Object.keys(v.attributes);
            const sKeys = Object.keys(selectedAttributes);
            const isMatch = vKeys.every(k => v.attributes[k] === selectedAttributes[k]);
            return vKeys.length === sKeys.length && isMatch;
        });
    }, [product, selectedAttributes]);

    // Available Attributes with Dummy Fallbacks
    const availableAttributes = useMemo(() => {
        if (!product?.variants || product.variants.length === 0) {
            // DUMMY SIZES AND COLORS FALLBACK
            return {
                'Color': ['Black', 'White', 'Blue', 'Grey'],
                'Size': ['S', 'M', 'L', 'XL', 'XXL']
            };
        }
        const attrs = {};
        product.variants.forEach(variant => {
            if (variant.attributes) {
                Object.entries(variant.attributes).forEach(([key, value]) => {
                    if (!attrs[key]) attrs[key] = new Set();
                    attrs[key].add(value);
                });
            }
        });
        Object.keys(attrs).forEach(key => {
            attrs[key] = Array.from(attrs[key]);
        });
        return attrs;
    }, [product]);

    useEffect(() => {
        setSelectedImage(0);
    }, [activeVariant]);

    const handleAttributeChange = (attrName, value) => {
        const newAttrs = { ...selectedAttributes, [attrName]: value };
        
        if (!product?.variants || product.variants.length === 0) {
            setSelectedAttributes(newAttrs);
            return;
        }

        const exactMatch = product.variants.find(v => {
            const vAttrs = v.attributes || {};
            return Object.keys(newAttrs).every(k => newAttrs[k] === vAttrs[k]) &&
                Object.keys(vAttrs).every(k => newAttrs[k] === vAttrs[k]);
        });

        if (exactMatch) {
            setSelectedAttributes(exactMatch.attributes);
        } else {
            const fallbackVariant = product.variants.find(v => v.attributes && v.attributes[attrName] === value);
            if (fallbackVariant) {
                setSelectedAttributes(fallbackVariant.attributes);
            } else {
                setSelectedAttributes(newAttrs);
            }
        }
    };

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-sm font-medium text-gray-500 animate-pulse">Retrieving product details...</p>
            </div>
        );
    }

    const displayImages = (activeVariant?.images && activeVariant.images.length > 0)
        ? activeVariant.images
        : (product.images && product.images.length > 0 ? product.images : [{ url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=600&auto=format&fit=crop' }]);

    const displayPrice = activeVariant?.price?.amount ? activeVariant.price : (product.price || { amount: 999 });

    return (
        <div className="min-w-full bg-white text-[#1b1c1a] antialiased px-4 md:px-12 lg:px-24 py-6 font-sans">
            
            {/* ── BREADCRUMBS ── */}
            <nav className="text-xs text-gray-400 mb-6 flex items-center gap-2">
                <Link to="/home" className="hover:underline">Home</Link> &gt; 
                <Link to="/shop" className="hover:underline">Shop</Link> &gt; 
                <Link to="/shirts" className="hover:underline">Shirts</Link> &gt;
                <span className="text-gray-600">{product.title || "Solid Black Shirt"}</span>
            </nav>

            {/* ── MAIN CONTAINER ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
                
                {/* ── LEFT: IMAGE GALLERY ── */}
                <div className="flex gap-4">
                    {/* Thumbnails */}
                    <div className="flex flex-col gap-3 w-20 flex-shrink-0">
                        {displayImages.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedImage(idx)}
                                className={`w-20 aspect-[3/4] overflow-hidden border ${selectedImage === idx ? 'border-black' : 'border-gray-200'}`}
                            >
                                <img src={img.url} alt="Thumbnail" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>

                    {/* Main Big Image */}
                    <div className="relative flex-1 aspect-[3/4] bg-gray-50 border border-gray-100 group">
                        <img 
                            src={displayImages[selectedImage]?.url} 
                            alt={product.title} 
                            className="w-full h-full object-cover"
                        />
                        <button className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* ── RIGHT: INFO & ACTIONS ── */}
                <div className="flex flex-col">
                    <h1 className="text-3xl font-semibold tracking-wide mb-2">{product.title || "Solid Black Shirt"}</h1>
                    
                    {/* DUMMY REVIEWS FALLBACK */}
                    <div className="flex items-center gap-1 mb-4 text-sm">
                        <div className="flex text-black text-xs tracking-tight">
                            <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                        </div>
                        <span className="text-gray-500 text-xs ml-1">({product.reviewCount || "128 reviews"})</span>
                    </div>

                    {/* DUMMY PRICE & OFF FALLBACK */}
                    <div className="flex items-baseline gap-3 mb-4">
                        <span className="text-2xl font-bold">₹{displayPrice?.amount || "999"}</span>
                        <span className="text-gray-400 line-through text-base">
                            {displayPrice?.originalAmount ? `₹${displayPrice.originalAmount}` : "₹1,499"}
                        </span>
                        <span className="text-red-500 font-medium text-sm">
                            {displayPrice?.discountPercent || "33% OFF"}
                        </span>
                    </div>

                    <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                        {product.description || "Classic solid black shirt made with premium cotton fabric. Perfect for casual, formal and party wear. Comfortable fit with fine stitching and stylish look."}
                    </p>

                    <div className="border-t border-gray-100 my-4"></div>

                    {/* Variant Attributes Mapping with Custom fallbacks */}
                    {Object.entries(availableAttributes).map(([attrName, values]) => (
                        <div key={attrName} className="mb-6">
                            <h3 className="text-xs font-semibold uppercase mb-3 text-gray-700">{attrName}:</h3>
                            <div className="flex flex-wrap gap-2 items-center">
                                {values.map(val => {
                                    const isSelected = selectedAttributes[attrName] === val;
                                    
                                    // Visual Condition if Attribute is Color
                                    if (attrName.toLowerCase() === 'color') {
                                        // Hex Mapping for dummy colors
                                        const colorMap = { black: '#1b1c1a', white: '#ffffff', blue: '#1e3a8a', grey: '#6b7280' };
                                        const bgHex = colorMap[val.toLowerCase()] || val;
                                        return (
                                            <button
                                                key={val}
                                                onClick={() => handleAttributeChange(attrName, val)}
                                                className={`w-7 h-7 rounded-full border border-gray-300 transition-all ${isSelected ? 'ring-2 ring-black ring-offset-2 scale-105' : 'hover:scale-105'}`}
                                                style={{ backgroundColor: bgHex }}
                                                title={val}
                                            />
                                        );
                                    }

                                    // Sizes Display
                                    return (
                                        <button
                                            key={val}
                                            onClick={() => handleAttributeChange(attrName, val)}
                                            className={`px-4 py-2 text-xs font-medium border transition-all min-w-[42px] text-center ${isSelected ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-800 hover:border-black'}`}
                                        >
                                            {val}
                                        </button>
                                    );
                                })}
                                {attrName.toLowerCase() === 'size' && (
                                    <button className="text-xs text-gray-500 underline ml-auto flex items-center gap-1">
                                        📐 Size Guide
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Quantity & Dummy Stock Status */}
                    <div className="mb-6">
                        <h3 className="text-xs font-semibold uppercase mb-3 text-gray-700">Quantity:</h3>
                        <div className="flex items-center gap-4">
                            <div className="flex border border-gray-300 rounded overflow-hidden">
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-1 bg-gray-50 text-gray-600 border-r border-gray-300 hover:bg-gray-100">-</button>
                                <span className="px-4 py-1 text-sm font-medium w-10 text-center flex items-center justify-center">{quantity}</span>
                                <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-1 bg-gray-50 text-gray-600 border-l border-gray-300 hover:bg-gray-100">+</button>
                            </div>
                            <span className="text-xs font-semibold text-green-600">
                                Only {activeVariant?.stock || "8"} items left in stock!
                            </span>
                        </div>
                    </div>

                    {/* Primary Action Buttons */}
                    <div className="flex gap-4 mb-8">
                        <button 
                            onClick={() => handleAddItem({ productId: product._id, variantId: activeVariant?._id })}
                            className="flex-1 bg-black text-white py-3.5 uppercase text-xs font-bold tracking-wider hover:bg-gray-900 transition-colors"
                        >
                            ADD TO CART
                        </button>
                        <button className="flex-1 border border-black py-3.5 uppercase text-xs font-bold tracking-wider hover:bg-gray-50 transition-colors">
                            BUY NOW
                        </button>
                    </div>

                    {/* Features Banner */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px] text-gray-500 border-t border-b border-gray-100 py-4 mb-4">
                        <div className="flex items-center gap-1.5"><span className="text-sm">🛡️</span> <span>Premium Quality <br/>Best Fabrics</span></div>
                        <div className="flex items-center gap-1.5"><span className="text-sm">🔄</span> <span>7 Days Returns <br/>Easy Returns</span></div>
                        <div className="flex items-center gap-1.5"><span className="text-sm">🚚</span> <span>Free Delivery <br/>On Order Above ₹999</span></div>
                        <div className="flex items-center gap-1.5"><span className="text-sm">🔒</span> <span>Secure Payment <br/>100% Protected</span></div>
                    </div>
                </div>
            </div>

            {/* ── BOTTOM SECTIONS ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-8 border-t border-gray-200">
                
                {/* ── TAB PANEL LEFT ── */}
                <div className="lg:col-span-1 flex flex-col md:flex-row gap-2">
                    <div className="flex flex-col w-full md:w-44 border-r-0 md:border-r border-gray-100 gap-1">
                        {['Description', 'Fabric & Care', 'Size & Fit', 'Shipping & Returns'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`text-left px-3 py-2 text-xs font-semibold rounded transition-colors ${activeTab === tab ? 'bg-gray-100 text-black' : 'text-gray-500 hover:text-black'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="flex-1 px-2 py-1">
                        {activeTab === 'Description' && (
                            <div className="text-xs text-gray-600 space-y-3 leading-relaxed">
                                <p>Elevate your wardrobe with our Solid Black Shirt, crafted from high-quality breathable cotton. It features a regular fit, spread collar, full sleeves with buttoned cuffs, and a curved hem.</p>
                                <ul className="list-disc pl-4 space-y-1 mt-2">
                                    <li>100% Premium Cotton</li>
                                    <li>Regular Fit</li>
                                    <li>Spread Collar</li>
                                    <li>Full Sleeve with Button Cuff</li>
                                    <li>Curved Hem</li>
                                </ul>
                            </div>
                        )}
                        {activeTab === 'Fabric & Care' && <p className="text-xs text-gray-600">100% Cotton. Machine wash warm with like colors.</p>}
                        {activeTab === 'Size & Fit' && <p className="text-xs text-gray-600">Regular fit. Model is 6'1" wearing size L.</p>}
                        {activeTab === 'Shipping & Returns' && <p className="text-xs text-gray-600">Free express delivery on all orders above ₹999.</p>}
                    </div>
                </div>

                {/* ── RECOMMENDED / RELATED PRODUCTS RIGHT ── */}
                <div className="lg:col-span-2">
                    <h3 className="text-sm font-bold tracking-wider uppercase mb-6 text-gray-800">You may also like</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { name: 'Classic White Shirt', img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=400' },
                            { name: 'Navy Blue Shirt', img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=400' },
                            { name: 'Grey Shirt', img: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=400' },
                            { name: 'Olive Green Shirt', img: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=400' }
                        ].map((item, index) => (
                            <div key={index} className="group relative cursor-pointer border border-transparent hover:border-gray-100 p-1">
                                <div className="aspect-[3/4] bg-gray-50 overflow-hidden relative mb-2">
                                    <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    <button className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full hover:bg-white text-gray-600 text-xs">
                                        ♡
                                    </button>
                                </div>
                                <h4 className="text-xs font-medium text-gray-700 truncate">{item.name}</h4>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <span className="text-xs font-bold">₹999</span>
                                    <span className="text-[10px] text-gray-400 line-through">₹1,499</span>
                                    <span className="text-[10px] text-red-500 font-semibold">33% OFF</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

        </div>
    );
};

export default ProductDetail;