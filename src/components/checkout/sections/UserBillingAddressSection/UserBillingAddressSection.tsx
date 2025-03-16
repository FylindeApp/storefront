import React, { Suspense } from "react";
import { useCheckoutFormValidationTrigger } from "../../hooks/useCheckoutFormValidationTrigger";
import { getById } from "../../lib/utils/common";
import { AddressSectionSkeleton } from "../../AddressSectionSkeleton";
import { UserAddressSectionContainer } from "../../../../components/checkout/sections/UserAddressSectionContainer";
import { useUserBillingAddressForm } from "../../../../components/checkout/sections/UserBillingAddressSection/useUserBillingAddressForm";
import { AddressCreateForm } from "../../../../components/checkout/sections/AddressCreateForm/AddressCreateForm";
import { AddressEditForm } from "../../../../components/checkout/sections/AddressEditForm/AddressEditForm";
import { AddressList } from "../../../../components/checkout/sections/AddressList/AddressList";
import { Checkbox } from "../../Checkbox";
import { useCheckout } from "../../hooks/useCheckout";
import { FormProvider } from "../../hooks/useForm/FormProvider";
import { useBillingSameAsShippingForm } from "../../../../components/checkout/sections/GuestBillingAddressSection/useBillingSameAsShippingForm";
import { type OptionalAddress } from "../../AddressForm/address/types";
import { getByMatchingAddress } from "../../AddressForm/address/utils";
import { type AddressFragment } from "../../graphql";

interface UserBillingAddressSectionProps { }

export const UserBillingAddressSection: React.FC<UserBillingAddressSectionProps> = ({ }) => {
	const {
		checkout: { isShippingRequired },
	} = useCheckout();

	const {
		form,
		userAddressActions: { onAddressCreateSuccess, onAddressDeleteSuccess, onAddressUpdateSuccess },
	} = useUserBillingAddressForm();

	const {
		resetForm,
		values: { addressList },
	} = form;

	const handleSetBillingSameAsShipping = (address: OptionalAddress) => {
		const matchingAddress = addressList.find(getByMatchingAddress(address));

		if (!address || !matchingAddress) {
			return;
		}

		resetForm({ values: { selectedAddressId: matchingAddress.id, addressList } });
	};

	const billingSameAsShippingForm = useBillingSameAsShippingForm({
		autoSave: false,
		onSetBillingSameAsShipping: handleSetBillingSameAsShipping,
	});

	useCheckoutFormValidationTrigger({
		scope: "billingAddress",
		form: billingSameAsShippingForm,
	});

	const {
		values: { billingSameAsShipping },
	} = billingSameAsShippingForm;

	return (
		<Suspense fallback={<AddressSectionSkeleton />}>
			{isShippingRequired && (
				<div className="mb-4">
					<FormProvider form={billingSameAsShippingForm}>
						<Checkbox
							name="billingSameAsShipping"
							label="Use shipping address as billing address"
							data-testid={"useShippingAsBillingCheckbox"}
						/>
					</FormProvider>
				</div>
			)}
			{!billingSameAsShipping && (
				<div className="pb-2">
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
										onClose={() => setDisplayAddressCreate(false)}
										onSuccess={onAddressCreateSuccess}
									/>
								)}

								{displayAddressEdit && (
									<AddressEditForm
										title="Billing address"
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
										title="Billing address"
										form={form}
									/>
								)}
							</>
						)}
					</UserAddressSectionContainer>
				</div>
			)}
		</Suspense>
	);
};
