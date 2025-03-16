import styled from "styled-components";

export const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #555;
  font-size: 0.9rem;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: #000;
  }

  &:disabled {
    color: #ccc;
    cursor: not-allowed;
  }
`;
