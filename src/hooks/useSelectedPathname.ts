import { useLocation, useParams } from "react-router-dom";

function useSelectedPathname() {
	const location = useLocation();
	const { channel } = useParams<{ channel?: string }>();

	const selectedPathname = channel ? location.pathname.replace(`/${channel}`, "") : location.pathname;

	return selectedPathname;
}

export default useSelectedPathname;
