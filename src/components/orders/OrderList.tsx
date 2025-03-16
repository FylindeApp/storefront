import React from "react";
import OrderListItem from "./OrderListItem";

type Props = {
    orders: any[];
};

const OrderList: React.FC<Props> = ({ orders }) => {
    return (
        <ul>
            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                orders.map((order) => <OrderListItem key={order.id} order={order} />)
            )}
        </ul>
    );
};

export default OrderList;
