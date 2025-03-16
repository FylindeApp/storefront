import React from "react";

import { formatDate, formatMoney } from "../../lib/utils";
import { type OrderDetailsFragment } from "../../gql/graphql";
import { PaymentStatus } from "../PaymentStatus";

type Props = {
    order: OrderDetailsFragment;
};

const OrderListItem = ({ order }: Props) => {
    return (
        <li className="bg-white border p-4 shadow-md">
            <h3>Order #{order.number}</h3>
            <p>Date: {formatDate(new Date(order.created))}</p>
            <p>Total: {formatMoney(order.total.gross.amount, order.total.gross.currency)}</p>
            <p>Status: <PaymentStatus status={order.paymentStatus} /></p>
        </li>
    );
};

export default OrderListItem;
