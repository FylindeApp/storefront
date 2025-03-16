import compact from "lodash-es/compact";
import React, { type PropsWithChildren, type HTMLAttributes } from "react";
import { type AddressFragment } from "./graphql";

interface AddressProps extends HTMLAttributes<HTMLDivElement> {
	address: Partial<AddressFragment>; // Make address fields optional for safety
}

export const Address: React.FC<PropsWithChildren<AddressProps>> = ({
	address,
	children,
	...textProps
}) => {
	const { firstName, lastName, phone, city, countryArea, postalCode, streetAddress1, country } = address;
	const name = `${firstName || ""} ${lastName || ""}`.trim(); // Ensure name doesn't break if missing values

	return (
		<div className="pointer-events-none flex flex-col" {...textProps}>
			{name && <p className="font-semibold">{name}</p>}
			{phone && <p>{phone}</p>}
			<p>{compact([streetAddress1, city, postalCode]).join(", ")}</p>
			<p>{compact([countryArea, country?.country]).join(", ")}</p>
			{children}
		</div>
	);
};
