import React from "react";
import { CheckoutContainer, CheckoutHeader } from "./CheckoutStyles";
import { RootWrapper } from "./rootWrapper"; // ✅ Now references App.tsx indirectly

const CheckoutPage: React.FC = () => {
	const fylindeApiUrl = process.env.REACT_APP_FYLINDE_API_URL;

	if (!fylindeApiUrl) {
		console.error("Missing API URL for Fylinde!");
		return <p>Unable to load checkout</p>;
	}

	return (
		<CheckoutContainer>
			<CheckoutHeader>
				<a aria-label="homepage" href="/">FYLINDE</a>
			</CheckoutHeader>
			<h1>Checkout</h1>
			<section className="checkout-content">
				<RootWrapper fylindeApiUrl={fylindeApiUrl} />
			</section>
		</CheckoutContainer>
	);
};

export default CheckoutPage;
