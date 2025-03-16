import React from "react";
import  App  from "../../App"; // ✅ Use the main App component

type Props = { fylindeApiUrl: string };

export const RootWrapper: React.FC<Props> = ({ fylindeApiUrl }) => {
	if (!fylindeApiUrl) return null;
	return <App fylindeApiUrl={fylindeApiUrl} />; // ✅ Pass the prop if needed
};
