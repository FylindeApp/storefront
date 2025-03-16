import React from "react";
import { PaymentMethods } from "./PaymentMethods";
import { Divider } from "../../Divider";
import { Title } from "../../Title";

export const PaymentSection = () => {
	return (
		<>
			<Divider />
			<div className="py-4" data-testid="paymentMethods">
				<Title>Payment methods</Title>
				<PaymentMethods />
			</div>
		</>
	);
};
