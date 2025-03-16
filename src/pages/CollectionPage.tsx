import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCollection } from "../store/slices/collectionSlice";
import { RootState, AppDispatch } from "../store";
import { ProductList } from "../components/ProductList";
import { CollectionContainer } from "./CollectionPage.styles";

type Props = {
    slug: string;
    channel: string;
};

const CollectionPage: React.FC<Props> = ({ slug, channel }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { name, products, status } = useSelector((state: RootState) => state.collection);

    useEffect(() => {
        dispatch(fetchCollection({ slug, channel }));
    }, [dispatch, slug, channel]);

    if (status === "loading") return <p>Loading products...</p>;
    if (!name) return <p>Collection not found.</p>;

    return (
        <CollectionContainer>
            <h1>{name}</h1>
            <ProductList products={products} />
        </CollectionContainer>
    );
};

export default CollectionPage;
