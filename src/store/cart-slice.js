import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalQuantity: 0,
    totalPrice: 0,
  },

  reducers: {
    addItemToCart(state, action) {
      const newItem = action.payload;
      const exsistingItem = state.items.find((item) => item.id === newItem.id);
      state.totalQuantity = state.totalQuantity + 1;

      if (!exsistingItem) {
        state.items.push({
          id: newItem.id,
          price: newItem.price,
          quantity: 1,
          totalPrice: newItem.price,
          name: newItem.title,
        });
      } else {
        exsistingItem.quantity++; // existingItem.quantity = exsistingItem.quantity + 1;
        exsistingItem.totalPrice = exsistingItem.totalPrice + newItem.price;
      }
    },
    removeItemFromCart(state, action) {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      state.totalQuantity = state.totalQuantity - 1;

      if (existingItem.quantity === 1) {
        // remove item from array
        state.items = state.items.filter((item) => item.id !== id); // ovewrite the array of items
      } else {
        existingItem.quantity--;
        existingItem.totalPrice = existingItem.totalPrice - existingItem.price;
      }
    },
  },
});

export const cartActions = cartSlice.actions;
export default cartSlice;
