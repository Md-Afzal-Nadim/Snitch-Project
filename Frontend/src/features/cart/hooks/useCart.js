import { addItem, getCart, incrementCartItemApi, decrementCartItemApi, createCartOrder, verifyCartOrder, fetchOrderById } from '../service/cart.api';
import { useDispatch } from 'react-redux';
import { setCart, incrementCartItem, decrementCartItem } from '../state/cart.slice';



export const useCart = () => {

  const dispatch = useDispatch();
  async function handleAddItem({ productId, variantId }) {
    const data = await addItem({ productId, variantId })
    if (data.success) {
      await handleGetCart();
    }
    return data;
  }

  async function handleGetCart() {
    const data = await getCart();
    dispatch(setCart(data.cart));
  }

  async function handleIncrementCartItem({ productId, variantId }) {
    const data = await incrementCartItemApi({ productId, variantId });
    dispatch(incrementCartItem({ productId, variantId }));
  }

  async function handleDecrementCartItem({ productId, variantId }) {
    const data = await decrementCartItemApi({ productId, variantId });
    dispatch(decrementCartItem({ productId, variantId }));
  }

  // UPDATED — now accepts addressId and passes it through to the API call
  async function handleCreateCartOrder(addressId) {
    const data = await createCartOrder(addressId);
    return data.order;
  }

  async function handleVerifyCartOrder({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
    const data = await verifyCartOrder({ razorpay_order_id, razorpay_payment_id, razorpay_signature });
    return data.success;
  }

  // NEW — used by OrderSuccess.jsx to reload-proof fetch a single order
  async function handleGetOrderById(razorpayOrderId) {
    const data = await fetchOrderById(razorpayOrderId);
    return data.order;
  }

  return {
    handleAddItem,
    handleGetCart,
    handleIncrementCartItem,
    handleDecrementCartItem,
    handleCreateCartOrder,
    handleVerifyCartOrder,
    handleGetOrderById,
  };
}





















