import React from "react";
import { ContactSkeleton } from "../../../../components/checkout/sections/Contact";
import { DeliveryMethodsSkeleton } from "../../../../components/checkout/sections/DeliveryMethods";
import { PaymentSectionSkeleton } from "../../../../components/checkout/sections/PaymentSection";
import { Divider } from "../../Divider";
import { AddressSectionSkeleton } from "../../AddressSectionSkeleton";

export const CheckoutFormSkeleton = () => (
	<div className="flex flex-col items-end">
		<div className="flex w-full flex-col rounded ">
			<ContactSkeleton />
			<Divider />
			<AddressSectionSkeleton />
			<Divider />
			<DeliveryMethodsSkeleton />
			<Divider />
			<PaymentSectionSkeleton />
		</div>
	</div>
);
