import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { deleteLineFromCheckout } from "../../services/cartService";
import { RootState } from "..";

export interface CartItem {
    id: string;
    name: string;
    price: number; // Seller's price
    checkoutId: string;
    quantity: number;
    imgUrl?: string;
    currency: string; // Seller's currency
}

export interface CartState {
    items: CartItem[];
    status: "idle" | "loading" | "failed";
}

const initialState: CartState = {
    items: [],
    status: "idle",
};

// Async action to remove item from cart
export const removeCartItem = createAsyncThunk(
    "cart/removeCartItem",
    async ({ lineId, checkoutId }: { lineId: string; checkoutId: string }) => {
        await deleteLineFromCheckout(lineId, checkoutId);
        return lineId; // Return the item ID to update state
    }
);

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setCartItems(state, action: PayloadAction<CartItem[]>) {
            state.items = action.payload;
        },
        changeCartAmount(state, action: PayloadAction<{ id: string; amount: number }>) {
            const item = state.items.find((item) => item.id === action.payload.id);
            if (item) {
                item.quantity = Math.max(1, action.payload.amount);
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(removeCartItem.pending, (state) => {
                state.status = "loading";
            })
            .addCase(removeCartItem.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item.id !== action.payload);
                state.status = "idle";
            })
            .addCase(removeCartItem.rejected, (state) => {
                state.status = "failed";
            });
    },
});

// Selector to calculate converted prices using exchange rates from `exchangeSlice`
export const selectCartWithConvertedPrices = (state: RootState) => {
    const { items } = state.cart;
    const { rates, baseCurrency } = state.exchangeRate;

    return items.map((item) => {
        const conversionRate = rates[item.currency] ?? 1; // Default to 1 if no rate available
        return {
            ...item,
            buyerPrice: item.price * conversionRate,
            buyerCurrency: baseCurrency,
        };
    });
};

export const { setCartItems, changeCartAmount } = cartSlice.actions;
export default cartSlice.reducer;
