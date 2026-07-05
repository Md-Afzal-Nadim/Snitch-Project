import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { stockOfVariant } from "../dao/product.dao.js";
import mongoose from "mongoose";
import { createOrder } from "../services/payment.service.js";
import { getCartDetails } from "../dao/cart.dao.js";
import paymentModel from "../models/payment.model.js";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";
import { config } from "../config/config.js";




export const addToCart = async (req, res) => {

    const { productId, variantId } = req.params
    const { quantity = 1 } = req.body

    const product = await productModel.findOne({
        _id: productId,
        "variants._id": variantId
    })

    if (!product) {
        return res.status(404).json({
            message: "Product or variant not found",
            success: false
        })
    }

    const stock = await stockOfVariant(productId, variantId)
    const selectedVariant = product.variants.find((variant) => variant._id.toString() === variantId)
    const cartPrice = selectedVariant?.price || product.price

    const cart = (await cartModel.findOne({ user: req.user._id })) ||
        (await cartModel.create({ user: req.user._id }))

    const isProductAlreadyInCart = cart.items.some(item => item.product.toString() === productId && item.variant?.toString() === variantId)

    if (isProductAlreadyInCart) {
        const existingItem = cart.items.find(item => item.product.toString() === productId && item.variant?.toString() === variantId)
        const quantityInCart = existingItem.quantity
        if (quantityInCart + quantity > stock) {
            return res.status(400).json({
                message: `Only ${stock} items left in stock. and you already have ${quantityInCart} items in your cart`,
                success: false
            })
        }

        await cartModel.findOneAndUpdate(
            { user: req.user._id, "items.product": productId, "items.variant": variantId },
            {
                $inc: { "items.$.quantity": quantity },
                $set: { "items.$.price": cartPrice }
            },
            { new: true }
        )

        return res.status(200).json({
            message: "Cart updated successfully",
            success: true
        })
    }

    if (quantity > stock) {
        return res.status(400).json({
            message: `Only ${stock} items left in stock`,
            success: false
        })
    }

    cart.items.push({
        product: productId,
        variant: variantId,
        quantity,
        price: cartPrice
    })

    await cart.save()

    return res.status(200).json({
        message: "Product added to cart successfully",
        success: true
    })
}

export const getCart = async (req, res) => {
    const user = req.user

    let cart = await getCartDetails(user._id)

    if (!cart) {
        cart = await cartModel.create({ user: user._id })
    }

    return res.status(200).json({
        message: "Cart fetched successfully",
        success: true,
        cart
    })
}

export const incrementCartItemQuantity = async (req, res) => {
    const { productId, variantId } = req.params

    const product = await productModel.findOne({
        _id: productId,
        "variants._id": variantId
    })

    if (!product) {
        return res.status(404).json({
            message: "Product or variant not found",
            success: false
        })
    }

    const cart = await cartModel.findOne({ user: req.user._id })

    if (!cart) {
        return res.status(404).json({
            message: "Cart not found",
            success: false
        })
    }

    const stock = await stockOfVariant(productId, variantId)

    const itemQuantityInCart = cart.items.find(item => item.product.toString() === productId && item.variant?.toString() === variantId)?.quantity || 0

    if (itemQuantityInCart + 1 > stock) {
        return res.status(400).json({
            message: `Only ${stock} items left in stock. and you already have ${itemQuantityInCart} items in your cart`,
            success: false
        })
    }

    const selectedVariant = product.variants.find((variant) => variant._id.toString() === variantId)
    const cartPrice = selectedVariant?.price || product.price

    await cartModel.findOneAndUpdate(
        { user: req.user._id, "items.product": productId, "items.variant": variantId },
        {
            $inc: { "items.$.quantity": 1 },
            $set: { "items.$.price": cartPrice }
        },
        { new: true }
    )

    return res.status(200).json({
        message: "Cart item quantity incremented successfully",
        success: true
    })
}

export const decrementCartItemQuantity = async (req, res) => {
    const { productId, variantId } = req.params;

    const cart = await cartModel.findOne({ user: req.user._id });

    if (!cart) {
        return res.status(404).json({
            message: "Cart not found",
            success: false
        });
    }

    const cartItem = cart.items.find(
        item =>
            item.product.toString() === productId &&
            item.variant?.toString() === variantId
    );

    if (!cartItem) {
        return res.status(404).json({
            message: "Item not found in cart",
            success: false
        });
    }

    // Agar quantity 1 hai to item remove kar do
    if (cartItem.quantity <= 1) {
        await cartModel.findOneAndUpdate(
            { user: req.user._id },
            {
                $pull: {
                    items: {
                        product: productId,
                        variant: variantId
                    }
                }
            }
        );

        return res.status(200).json({
            message: "Item removed from cart",
            success: true
        });
    }

    // Quantity decrement karo
    await cartModel.findOneAndUpdate(
        {
            user: req.user._id,
            "items.product": productId,
            "items.variant": variantId
        },
        {
            $inc: {
                "items.$.quantity": -1
            }
        },
        { new: true }
    );

    return res.status(200).json({
        message: "Cart item quantity decremented successfully",
        success: true
    });
};




/*export const createOrderController = async (req, res) => {


    const cart = await getCartDetails(req.user._id)



    if (!cart) {
        return res.status(400).json({
            message: "Cart is empty",
            success: false
        })
    }

    const order = await createOrder({ amount: cart.totalPrice, currency: cart.currency })

    const payment = await paymentModel.create({
        user: req.user._id,
        razorpay: {
            orderId: order.id,
        },
        price: {
            amount: cart.totalPrice,
            currency: cart.currency
        },
        orderItems: cart.items.map(item => {
            const selectedVariant = item.product.variants?.find((variant) => variant._id?.toString() === item.variant?.toString());

            return {
                title: item.product.title,
                productId: item.product._id,
                variantId: item.variant,
                quantity: item.quantity,
                images: selectedVariant?.images || item.product.images,
                description: item.product.description,
                price: {
                    amount: selectedVariant?.price?.amount ?? item.price?.amount ?? item.product.price?.amount,
                    currency: selectedVariant?.price?.currency ?? item.price?.currency ?? item.product.price?.currency
                }
            };
        })
    })

    return res.status(200).json({
        message: "Order created successfully",
        success: true,
        order
    })
}*/

export const verifyOrderController = async (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    } = req.body

    const payment = await paymentModel.findOne({
        "razorpay.orderId": razorpay_order_id,
        status: "pending"
    })

    if (!payment) {
        return res.status(400).json({
            message: "Payment not found",
            success: false
        })
    }

    const isPaymentValid = validatePaymentVerification({
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
    }, razorpay_signature, config.RAZORPAY_KEY_SECRET)

    if (!isPaymentValid) {
        payment.status = "failed"
        await payment.save()

        return res.status(400).json({
            message: "Payment verification failed",
            success: false
        })
    }

    payment.status = "paid"

    payment.razorpay.paymentId = razorpay_payment_id
    payment.razorpay.signature = razorpay_signature

    await payment.save()

    return res.status(200).json({
        message: "Payment verified successfully",
        success: true
    })
}

export const getUserOrdersController = async (req, res) => {
    try {
        const payments = await paymentModel
            .find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            message: "Orders fetched successfully",
            success: true,
            orders: payments,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch orders", success: false });
    }
};









// ─── Update createOrderController — accept addressId from the frontend ───
export const createOrderController = async (req, res) => {

    const { addressId } = req.body; // <-- NEW: frontend sends the selected address's _id

    if (!addressId) {
        return res.status(400).json({
            message: "Address is required to place an order",
            success: false
        });
    }

    const cart = await getCartDetails(req.user._id)

    if (!cart) {
        return res.status(400).json({
            message: "Cart is empty",
            success: false
        })
    }

    const order = await createOrder({ amount: cart.totalPrice, currency: cart.currency })

    const payment = await paymentModel.create({
        user: req.user._id,
        addressId, // <-- NEW: save it right at creation time
        razorpay: {
            orderId: order.id,
        },
        price: {
            amount: cart.totalPrice,
            currency: cart.currency
        },
        orderItems: cart.items.map(item => {
            const selectedVariant = item.product.variants?.find((variant) => variant._id?.toString() === item.variant?.toString());

            return {
                title: item.product.title,
                productId: item.product._id,
                variantId: item.variant,
                quantity: item.quantity,
                images: selectedVariant?.images || item.product.images,
                description: item.product.description,
                price: {
                    amount: selectedVariant?.price?.amount ?? item.price?.amount ?? item.product.price?.amount,
                    currency: selectedVariant?.price?.currency ?? item.price?.currency ?? item.product.price?.currency
                }
            };
        })
    })

    return res.status(200).json({
        message: "Order created successfully",
        success: true,
        order
    })
}

// ─── NEW: fetch a single order by its razorpay order_id ───
// This is what OrderSuccess.jsx calls on page reload, since Redux memory
// is gone by then but this hits MongoDB directly.
export const getOrderByIdController = async (req, res) => {
    const { razorpayOrderId } = req.params;

    const payment = await paymentModel
        .findOne({
            "razorpay.orderId": razorpayOrderId,
            user: req.user._id, // ensures users can only fetch their own orders
        })
        .populate("addressId")
        .lean();

    if (!payment) {
        return res.status(404).json({
            message: "Order not found",
            success: false
        });
    }

    return res.status(200).json({
        message: "Order fetched successfully",
        success: true,
        order: payment
    });
};