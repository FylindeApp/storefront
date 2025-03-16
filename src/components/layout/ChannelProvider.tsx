import React, { createContext, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchChannels, selectChannels, selectCurrentChannel, setCurrentChannel } from "../../store/slices/channelSlice";
import { AppDispatch } from "../../store";


// ✅ Define a type for the context
interface ChannelContextProps {
    channel: string;
}

// ✅ Create context with default values
const ChannelContext = createContext<ChannelContextProps>({ channel: "default-channel" });

// ✅ Hook to use the context
export const useChannel = () => useContext(ChannelContext);

// ✅ Define the Channel type
interface Channel {
    id: string;
    name: string;
}

// ✅ Fix the ChannelProvider
const ChannelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useDispatch<AppDispatch>();
    const channels = useSelector(selectChannels) as Channel[];  // ✅ Type assertion
    const currentChannel = useSelector(selectCurrentChannel);

    useEffect(() => {
        dispatch(fetchChannels()); // Fetch channels on mount
    }, [dispatch]);

    return (
        <ChannelContext.Provider value={{ channel: currentChannel }}>
            <div>
                <h2>Current Channel: {currentChannel}</h2>
                <ul>
                    {channels.map((channel: Channel) => (
                        <li key={channel.id}>
                            <button onClick={() => dispatch(setCurrentChannel(channel.id))}>
                                {channel.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            {children} {/* ✅ Fix: Ensure children are used inside the provider */}
        </ChannelContext.Provider>
    );
};

export default ChannelProvider;
