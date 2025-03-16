import { UserIcon } from "lucide-react";
import { UserMenu } from "./UserMenu";
import { CurrentUserDocument } from "../../../../gql/graphql";
import { executeGraphQL } from "../../../../lib/graphql";
import { LinkWithChannel } from "../../../atoms/LinkWithChannel";

export async function UserMenuContainer() {
	const { me: user } = await executeGraphQL(CurrentUserDocument, {
		variables: {}, // ✅ Fix: Provide an empty variables object
		cache: "no-cache",
	});

	if (user) {
		return <UserMenu user={user} />;
	} else {
		return (
			<LinkWithChannel to="/login" className="h-6 w-6 flex-shrink-0">
				<UserIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
				<span className="sr-only">Log in</span>
			</LinkWithChannel>
		);
	}
}
