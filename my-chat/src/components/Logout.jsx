import React from "react";
import styled from "styled-components";
import { BiLogOut } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();
  const handleClick = async () => {
    localStorage.clear();
    navigate("/login");
  };
  return (
    <Button onClick={handleClick}>
      <BiLogOut />
    </Button>
  );
}

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #9a86f3;
  border: none;
  cursor: pointer;
  position: absolute;
  right: 0;
  margin: 10px;
  svg {
    font-size: 1.3rem;
    color: #ebe7ff;
  }
`;
