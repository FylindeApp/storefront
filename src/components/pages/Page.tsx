import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPage } from "../../store/slices/pageSlice";
import { RootState, AppDispatch } from "../../store";
import DOMPurify from "dompurify"; // ✅ Security Improvement
import { PageContainer } from "./Page.styles";

type Props = {
    slug: string;
    channel: string;
};

const Page: React.FC<Props> = ({ slug, channel }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { title, content, status } = useSelector((state: RootState) => state.page);

    useEffect(() => {
        dispatch(fetchPage({ slug}));
    }, [dispatch, slug, channel]);

    if (status === "loading") return <p>Loading...</p>;
    if (!title) return <p>Page not found.</p>;

    return (
        <PageContainer>
            <h1>{title}</h1>
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content || "") }} />
        </PageContainer>
    );
};

export default Page;
