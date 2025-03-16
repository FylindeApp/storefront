import React, { Suspense } from "react";
import { getById } from "../../lib/utils/common";
import { AddressSectionSkeleton } from "../../AddressSectionSkeleton";
import { UserAddressSectionContainer } from "../../../../components/checkout/sections/UserAddressSectionContainer";
import { useUserShippingAddressForm } from "../../../../components/checkout/sections/UserShippingAddressSection/useUserShippingAddressForm";
import { AddressCreateForm } from "../../../../components/checkout/sections/AddressCreateForm";
import { AddressEditForm } from "../../../../components/checkout/sections/AddressEditForm";
import { AddressList } from "../../../../components/checkout/sections/AddressList/AddressList";
import { type AddressFragment } from "../../graphql";
import { useCheckoutFormValidationTrigger } from "../../hooks/useCheckoutFormValidationTrigger";
import { useAvailableShippingCountries } from "../../hooks/useAvailableShippingCountries";

interface UserShippingAddressSectionProps { }

export const UserShippingAddressSection: React.FC<UserShippingAddressSectionProps> = ({ }) => {
	const { availableShippingCountries } = useAvailableShippingCountries();
	const {
		form,
		userAddressActions: { onAddressCreateSuccess, onAddressDeleteSuccess, onAddressUpdateSuccess },
	} = useUserShippingAddressForm();

	useCheckoutFormValidationTrigger({
		scope: "shippingAddress",
		form: form,
	});

	return (
		<Suspense fallback={<AddressSectionSkeleton />}>
			<UserAddressSectionContainer>
				{({
					displayAddressCreate,
					displayAddressEdit,
					displayAddressList,
					setDisplayAddressCreate,
					setDisplayAddressEdit,
					editedAddressId,
				}) => (
					<>
						{displayAddressCreate && (
							<AddressCreateForm
								availableCountries={availableShippingCountries}
								onClose={() => setDisplayAddressCreate(false)}
								onSuccess={onAddressCreateSuccess}
							/>
						)}

						{displayAddressEdit && (
							<AddressEditForm
								availableCountries={availableShippingCountries}
								title="Shipping address"
								onClose={() => setDisplayAddressEdit()}
								address={form.values.addressList.find(getById(editedAddressId)) as AddressFragment}
								onUpdate={onAddressUpdateSuccess}
								onDelete={onAddressDeleteSuccess}
							/>
						)}

						{displayAddressList && (
							<AddressList
								onEditChange={setDisplayAddressEdit}
								onAddAddressClick={() => setDisplayAddressCreate(true)}
								title="Shipping address"
								checkAddressAvailability={true}
								form={form}
							/>
						)}
					</>
				)}
			</UserAddressSectionContainer>
		</Suspense>
	);
};
