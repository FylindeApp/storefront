import React from "react";
import CategoryPage from "../../pages/CategoryPage"; // ✅ Updated path to new structure

const Category = ({ params }: { params: { slug: string; channel: string } }) => {
    return <CategoryPage slug={params.slug} channel={params.channel} />;
};

export default Category;
