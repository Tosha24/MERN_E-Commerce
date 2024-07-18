import { createSlice } from "@reduxjs/toolkit";

const initialState = localStorage.getItem("shippingAddress")
  ? JSON.parse(localStorage.getItem("shippingAddress"))
  : { shippingAddress: {}, paymentMethod: "PayPal" };

const cartSlice = createSlice({
  name: "shippingAddress",
  initialState,
  reducers: {
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
    },

    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
    },

    clearCheckoutInfo: (state) => {
      state.shippingAddress = [];
      localStorage.setItem("cart", JSON.stringify(state));
    },
  },
});

export const { savePaymentMethod, saveShippingAddress, clearCheckoutInfo } =
  cartSlice.actions;
export default cartSlice.reducer;
