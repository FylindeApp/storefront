// src/pages/checkout/CheckoutLayout.tsx (Client Component)
"use client";

import React, { ReactNode } from "react";
import { AuthProvider } from "../../components/AuthProvider";

type Props = {
	children: ReactNode;
};

const CheckoutLayout: React.FC<Props> = ({ children }) => {
	return (
		<main>
			<AuthProvider>{children}</AuthProvider>
		</main>
	);
};

export default CheckoutLayout;
