import axios from "axios";


const cartApiInstance = axios.create({
  baseURL: "/api/cart",
  withCredentials: true,
});




export const addItem = async ({ productId, variantId }) => {

  const response = await cartApiInstance.post(`/add/${productId}/${variantId}`, {
    quantity: 1
  });
  return response.data;

}



export const getCart = async () => {
  const response = await cartApiInstance.get(`/`);
  return response.data;
}


export const incrementCartItemApi = async ({ productId, variantId }) => {
  const response = await cartApiInstance.patch(`/quantity/increment/${productId}/${variantId}`);
  return response.data;
}


export const decrementCartItemApi = async ({ productId, variantId }) => {
  const response = await cartApiInstance.patch(`/quantity/decrement/${productId}/${variantId}`);
  return response.data;
}


// UPDATED — now accepts and sends addressId so the backend can save it
// on the Payment doc right at order-creation time.
export const createCartOrder = async (addressId) => {
  const response = await cartApiInstance.post("/payment/create/order", { addressId });
  return response.data;
}


export const verifyCartOrder = async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
  const response = await cartApiInstance.post("/payment/verify/order", { razorpay_order_id, razorpay_payment_id, razorpay_signature });
  return response.data;
}

export const fetchUserOrders = async () => {
  const response = await cartApiInstance.get("/payment/orders");
  return response.data;
}

// NEW — fetch a single order by its razorpay order_id.
// This is what OrderSuccess.jsx calls on page reload, since Redux state
// is gone by then but this hits the backend/DB directly.
export const fetchOrderById = async (razorpayOrderId) => {
  const response = await cartApiInstance.get(`/payment/order/${razorpayOrderId}`);
  return response.data;
}


























