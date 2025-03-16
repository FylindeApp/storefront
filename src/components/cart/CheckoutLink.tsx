import React from "react";
import { Link } from "react-router-dom"; // Using React Router instead of Next.js

type Props = {
	checkoutUrl: string;
};

export const CheckoutLink: React.FC<Props> = ({ checkoutUrl }) => {
	return (
		<Link to={checkoutUrl} className="text-blue-600 hover:underline">
			Proceed to Checkout
		</Link>
	);
};
