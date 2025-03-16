import { Suspense, useState } from "react";
import { useCheckout } from "../../hooks/useCheckout";
import { Contact } from "../../sections/Contact";
import { DeliveryMethods } from "../../../../components/checkout/sections/DeliveryMethods";
import { ContactSkeleton } from "../../../../components/checkout/sections/Contact/ContactSkeleton";
import { DeliveryMethodsSkeleton } from "../../../../components/checkout/sections/DeliveryMethods";
import { AddressSectionSkeleton } from "../../AddressSectionSkeleton";
import { getQueryParams } from "../../lib/utils/url";
import { CollapseSection } from "../../../../components/checkout/sections/CheckoutForm/CollapseSection";
import { Divider } from ".././../Divider";
import { UserShippingAddressSection } from "../../../../components/checkout/sections/UserShippingAddressSection";
import { GuestShippingAddressSection } from "../../../../components/checkout/sections/GuestShippingAddressSection";
import { UserBillingAddressSection } from "../../../../components/checkout/sections/UserBillingAddressSection";
import { PaymentSection, PaymentSectionSkeleton } from "../../../../components/checkout/sections/PaymentSection";
import { GuestBillingAddressSection } from "../../../../components/checkout/sections/GuestBillingAddressSection";
import { useUser } from "../../hooks/useUser";

export const CheckoutForm = () => {
	const { user } = useUser();
	const { checkout } = useCheckout();
	const { passwordResetToken } = getQueryParams();

	const [showOnlyContact, setShowOnlyContact] = useState(!!passwordResetToken);

	return (
		<div className="flex flex-col items-end">
			<div className="flex w-full flex-col rounded">
				<Suspense fallback={<ContactSkeleton />}>
					<Contact setShowOnlyContact={setShowOnlyContact} />
				</Suspense>
				<>
					{checkout?.isShippingRequired && (
						<Suspense fallback={<AddressSectionSkeleton />}>
							<CollapseSection collapse={showOnlyContact}>
								<Divider />
								<div className="py-4" data-testid="shippingAddressSection">
									{user ? <UserShippingAddressSection /> : <GuestShippingAddressSection />}
								</div>
								{user ? <UserBillingAddressSection /> : <GuestBillingAddressSection />}
							</CollapseSection>
						</Suspense>
					)}
					<Suspense fallback={<DeliveryMethodsSkeleton />}>
						<DeliveryMethods collapsed={showOnlyContact} />
					</Suspense>
					<Suspense fallback={<PaymentSectionSkeleton />}>
						<CollapseSection collapse={showOnlyContact}>
							<PaymentSection />
						</CollapseSection>
					</Suspense>
				</>
			</div>
		</div>
	);
};
