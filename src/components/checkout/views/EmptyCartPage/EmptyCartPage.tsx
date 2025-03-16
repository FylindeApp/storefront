import React from "react";
import { Title } from "../../Title";
import { LinkAsButton } from "../../LinkAsButton";
import { ErrorContentWrapper } from "../../ErrorContentWrapper";

export const EmptyCartPage = () => {
	return (
		<ErrorContentWrapper>
			<Title className="mb-0 text-xl">Your cart is empty</Title>
			<p>Add anything to the cart to continue.</p>
			<LinkAsButton href="/" variant="secondary">
				Go back to store
			</LinkAsButton>
		</ErrorContentWrapper>
	);
};
