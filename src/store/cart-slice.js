import { createSlice } from '@reduxjs/toolkit';
import { uiActions } from './ui-slice';

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

// action creator thunk
export const sendCartData = (cart) => {
  return async (dispatch) => {
    dispatch(
      uiActions.showNotification({
        status: 'pending',
        title: 'Sending cart data',
        message: 'Sending cart data...',
      })
    );

    const sendRequest = async () => {
      const response = await fetch(
        'https://store-test-project-default-rtdb.europe-west1.firebasedatabase.app/cart.json',
        {
          method: 'PUT',
          body: JSON.stringify(cart),
        }
      );

      if (!response.ok) {
        throw new Error('Sending cart data failed!');
      }
    };

    try {
      await sendRequest();
      dispatch(
        uiActions.showNotification({
          status: 'success',
          title: 'Success!',
          message: 'Sending cart data is successful!',
        })
      );
    } catch (error) {
      sendCartData().catch((error) => {
        uiActions.showNotification({
          status: 'error',
          title: 'Error!',
          message: 'Sending cart data failed!',
        });
      });
    }
  };
};
export const cartActions = cartSlice.actions;
export default cartSlice;
