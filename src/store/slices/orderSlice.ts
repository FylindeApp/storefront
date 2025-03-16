import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUserOrders } from "../../services/orderService";

interface OrderState {
    orders: any[];
    user: { firstName: string; email: string } | null;
    status: "idle" | "loading" | "failed";
}

const initialState: OrderState = {
    orders: [],
    user: null,
    status: "idle",
};

// Async action to fetch user orders
export const fetchOrders = createAsyncThunk("orders/fetchOrders", async () => {
    return await fetchUserOrders();
});

const orderSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                if (action.payload) {
                    state.user = action.payload;
                    state.orders = action.payload.orders?.edges.map((e: any) => e.node) || [];
                }
                state.status = "idle";
            })
            .addCase(fetchOrders.rejected, (state) => {
                state.status = "failed";
            });
    },
});

export default orderSlice.reducer;
