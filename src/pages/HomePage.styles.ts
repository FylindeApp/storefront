import styled from "styled-components";

export const HomePageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;

    h1 {
        font-size: 2rem;
        margin-bottom: 20px;
        text-align: center;
        color: #333;
    }

    @media (max-width: 768px) {
        padding: 10px;

        h1 {
            font-size: 1.5rem;
        }
    }
`;
