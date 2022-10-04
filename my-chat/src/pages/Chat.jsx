import React, { useEffect, useState } from "react";
import { getUser } from "../utils/localStorage";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { allUsersRoute } from "../utils/apiRoutes";

export default function Chat() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    if (!getUser()) {
      navigate("/login");
    } else {
      setCurrentUser(getUser());
    }
  }, [navigate]);

  useEffect(() => {
    if(currentUser){
      async function getAllUsers() {
        const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
        setContacts(data.users);
      }
      getAllUsers();
    }
  }, [currentUser]);

  return (
    <Container>
      <div className="container"></div>
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
