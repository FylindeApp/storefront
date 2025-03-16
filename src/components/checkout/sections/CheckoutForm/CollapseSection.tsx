import { type Children } from "../../lib/globalTypes";

interface CollapseSectionProps extends Children {
	collapse: boolean;
}

export const CollapseSection: React.FC<CollapseSectionProps> = ({ collapse, children }) => {
	if (collapse) return null;
	return <>{children}</>;
};
