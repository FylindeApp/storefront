import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "@/store/slices/orderSlice";
import { RootState, AppDispatch } from "@/store";
import LoginForm from "../components/login/LoginForm";
import OrderList from "../components/orders/OrderList";
import { OrderPageContainer } from "./OrderPage.styles";

const OrderPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user, orders, status } = useSelector((state: RootState) => state.orders);

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    if (status === "loading") return <p>Loading orders...</p>;
    if (!user) return <LoginForm />;

    return (
        <OrderPageContainer>
            <h1>{user.firstName ? user.firstName : user.email}'s Orders</h1>
            <OrderList orders={orders} />
        </OrderPageContainer>
    );
};

export default OrderPage;
