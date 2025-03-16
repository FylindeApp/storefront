import styled from "styled-components";

export const AddressFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .form-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;

    @media (min-width: 768px) {
      grid-template-columns: 1fr 1fr;
    }
  }
`;
