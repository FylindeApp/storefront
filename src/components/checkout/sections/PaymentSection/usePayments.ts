import { useEffect } from "react";
import { useCheckout } from "../../hooks/useCheckout";
import { useCheckoutComplete } from "../../hooks/useCheckoutComplete";
import { type PaymentStatus } from "../PaymentSection/types";
import { usePaymentGatewaysInitialize } from "../PaymentSection/usePaymentGatewaysInitialize";
import { usePaymentStatus } from "../PaymentSection/utils";

const paidStatuses: PaymentStatus[] = ["overpaid", "paidInFull", "authorized"];

export const usePayments = () => {
	const { checkout } = useCheckout();
	const paymentStatus = usePaymentStatus(checkout);

	const { fetching, availablePaymentGateways } = usePaymentGatewaysInitialize();

	const { onCheckoutComplete, completingCheckout } = useCheckoutComplete();

	useEffect(() => {
		// the checkout was already paid earlier, complete
		if (!completingCheckout && paidStatuses.includes(paymentStatus)) {
			void onCheckoutComplete();
		}
	}, [completingCheckout, onCheckoutComplete, paymentStatus]);

	return { fetching, availablePaymentGateways };
};
