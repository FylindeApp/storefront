import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "./slices/categorySlice";
import collectionReducer from "./slices/collectionSlice";
import cartReducer from "./slices/cartSlice"; // ✅ Added Cart Slice
import authReducer from "./slices/authSlice";
import orderReducer from "./slices/orderSlice";
import pageReducer from "./slices/pageSlice";
import addressReducer from "@/store/slices/addressSlice";
import channelReducer from "./slices/channelSlice";
import exchangeRateReducer from "./slices/exchangeRateSlice"
import searchReducer from "./slices/searchSlice"
import draftReducer from "./slices/draftSlice";
import recommendationReducer from "./slices/recommendationSlice"
import userReducer from "./slices/userSlice"
import wishlistReducer from "./slices/wishlistSlice"
import productReducer from "./slices/productSlice"

export const store = configureStore({
    reducer: {
        category: categoryReducer,
        collection: collectionReducer,
        cart: cartReducer, // ✅ Added cart to the store
        auth: authReducer,
        orders: orderReducer,
        page: pageReducer,
        address: addressReducer,
        channel: channelReducer,
        exchangeRate: exchangeRateReducer,
        search: searchReducer,
        draft: draftReducer, 
        recommendation: recommendationReducer,
        user: userReducer,
        wishlist: wishlistReducer,
        products: productReducer
    },

});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
