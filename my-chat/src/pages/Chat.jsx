import React, { useEffect, useRef, useState } from "react";
import { getUser } from "../utils/localStorage";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { allUsersRoute, host } from "../utils/apiRoutes";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";
import { io } from "socket.io-client";
import { BiMenu } from "react-icons/bi";
import Logout from "../components/Logout";
import { useClickOutside } from "../utils/hooks";

export default function Chat() {
  const socket = useRef();
  const chatRef = useRef();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState();
  const [currentChat, setCurrentChat] = useState();
  const [contactsOpen, setContactsOpen] = useState(true);

  useEffect(() => {
    const user = getUser();
    if (!user) {
      navigate("/login");
    }
    if (!user.isAvatarImageSet) {
      navigate("/set-avatar");
    } else {
      setCurrentUser(user);
    }
  }, [navigate]);

  const toggleContacts = () => {
    const newValue = !contactsOpen;
    setContactsOpen(newValue);
    if (newValue) {
      chatRef.current.style.filter = "blur(2px)";
    } else {
      chatRef.current.style.filter = "blur(0)";
    }
  };

  useEffect(() => {
    if (currentUser) {
      async function getAllUsers() {
        const users = await axios.get(`${allUsersRoute}/${currentUser._id}`);
        setContacts(users.data);
      }
      getAllUsers();
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  const contactsRef = useClickOutside(() => {
    contactsOpen && toggleContacts();
  });

  return (
    <Container>
      <div className="container">
        <div ref={contactsRef}>
          <button className="toggle-contacts" onClick={toggleContacts}>
            <BiMenu />
          </button>
          {contactsOpen && (
            <Contacts
              contacts={contacts}
              currentUser={currentUser}
              changeChat={handleChatChange}
            />
          )}
        </div>
        <div ref={chatRef} className="chat-ref">
          <Logout />
          {!currentChat ? (
            <Welcome currentUser={currentUser} />
          ) : (
            <ChatContainer
              currentChat={currentChat}
              currentUser={currentUser}
              socket={socket}
            />
          )}
        </div>
      </div>
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
    position: relative;
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
    .toggle-contacts {
      position: absolute;
      margin: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0.5rem;
      border-radius: 0.5rem;
      background-color: #9a86f3;
      border: none;
      cursor: pointer;
      z-index: 9;
      svg {
        font-size: 1.3rem;
        color: #ebe7ff;
      }
    }
    .chat-ref {
      width: inherit;
      height: inherit;
      filter: blur(2px);
    }
  }
`;
