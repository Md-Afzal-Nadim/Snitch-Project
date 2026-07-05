import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";

export async function getCartDetails(userId) {
    const cart = await cartModel.findOne({ user: userId }).lean();

    if (!cart) {
        return null;
    }

    const productIds = cart.items.map((item) => item.product);
    const products = await productModel.find({ _id: { $in: productIds } }).lean();
    const productMap = new Map(products.map((product) => [product._id.toString(), product]));

    const items = cart.items.map((item) => {
        const product = productMap.get(item.product.toString());
        const selectedVariant = product?.variants?.find(
            (variant) => variant?._id?.toString() === item.variant?.toString()
        ) || null;

        const priceAmount = selectedVariant?.price?.amount ?? item.price?.amount ?? product?.price?.amount ?? 0;
        const priceCurrency = selectedVariant?.price?.currency ?? item.price?.currency ?? product?.price?.currency ?? "INR";
        const variantImage = selectedVariant?.images?.find((img) => img?.url)?.url
            || product?.images?.find((img) => img?.url)?.url
            || null;

        return {
            ...item,
            product: {
                ...(product || {}),
                variants: selectedVariant ? [selectedVariant] : product?.variants || [],
            },
            variantDetails: selectedVariant,
            variantImage,
            price: {
                amount: Number(priceAmount),
                currency: priceCurrency,
            },
        };
    });

    const totalPrice = items.reduce((sum, item) => sum + Number(item.price?.amount || 0) * Number(item.quantity || 1), 0);

    return {
        ...cart,
        items,
        totalPrice,
        currency: items[0]?.price?.currency || cart.currency || "INR",
    };
}