import styled from "styled-components";

export const CheckoutContainer = styled.div`
  min-height: 100vh;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
`;

export const CheckoutHeader = styled.div`
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;

  a {
    text-decoration: none;
    color: #000;
  }
`;

export const CheckoutContent = styled.section`
  width: 100%;
  max-width: 900px;
  padding: 2rem;
`;
