import styled from "styled-components";

export const AppLayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  main {
    flex: 1;
    padding: 2rem;
  }
  .section-after-sticky {
    margin-top: 80px;
  }
`;
