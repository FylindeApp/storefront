import { paymentMethodToComponent } from "./supportedPaymentApps";
import { PaymentSectionSkeleton } from "../PaymentSection/PaymentSectionSkeleton";
import { usePayments } from "../PaymentSection/usePayments";
import { useCheckoutUpdateState } from "../../state/updateStateStore";

export const PaymentMethods = () => {
	const { availablePaymentGateways, fetching } = usePayments();
	const {
		changingBillingCountry,
		updateState: { checkoutDeliveryMethodUpdate },
	} = useCheckoutUpdateState();

	// delivery methods change total price so we want to wait until the change is done
	if (changingBillingCountry || fetching || checkoutDeliveryMethodUpdate === "loading") {
		return <PaymentSectionSkeleton />;
	}

	return (
		<div className="gap-y-8">
			{availablePaymentGateways.map((gateway) => {
				const Component = paymentMethodToComponent[gateway.id];
				return (
					<Component
						key={gateway.id}
						// @ts-expect-error -- gateway matches the id but TypeScript doesn't know that
						config={gateway}
					/>
				);
			})}
		</div>
	);
};
