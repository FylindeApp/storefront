import React from "react";
import CollectionPage from "../../pages/CollectionPage"; // ✅ Correct import

const Collection = ({ params }: { params: { slug: string; channel: string } }) => {
    return <CollectionPage slug={params.slug} channel={params.channel} />;
};

export default Collection;
