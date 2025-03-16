import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategory } from "../store/slices/categorySlice";
import { RootState, AppDispatch } from "../store";
import { ProductList } from "../components/ProductList";
import { CategoryContainer } from "./CategoryPage.styles";


type Props = {
    slug: string;
    channel: string;
};

const CategoryPage: React.FC<Props> = ({ slug, channel }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { name, products, status } = useSelector((state: RootState) => state.category);

    useEffect(() => {
        dispatch(fetchCategory({ slug, channel }));
    }, [dispatch, slug, channel]);

    if (status === "loading") return <p>Loading products...</p>;
    if (!name) return <p>Category not found.</p>;

    return (
        <CategoryContainer>
            <h1>{name}</h1>
            <ProductList products={products} />
        </CategoryContainer>
    );
};

export default CategoryPage;
