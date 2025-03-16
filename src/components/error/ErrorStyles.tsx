import styled from "styled-components";

export const ErrorContainer = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
`;

export const ErrorMessage = styled.p`
  margin-top: 1rem;
  font-size: 1rem;
  color: #555;
  text-align: center;
  max-width: 500px;
`;

export const ErrorButton = styled.button`
  margin-top: 1.5rem;
  height: 40px;
  background-color: #ff4d4f;
  padding: 0 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s all ease-in-out;

  &:hover {
    background-color: #d9363e;
  }
`;
