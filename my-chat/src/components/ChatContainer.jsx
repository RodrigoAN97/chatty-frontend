import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { getAllMessagesRoute, sendMessageRoute } from "../utils/apiRoutes";
import ChatInput from "./ChatInput";
import Logout from "./Logout";

export default function ChatContainer({ currentChat, currentUser, socket }) {
  const [messages, setMessages] = useState();
  const [arrivalMessage, setArrivalMessage] = useState();
  const scrollRef = useRef();

  useEffect(() => {
    async function getMessages() {
      const res = await axios.post(getAllMessagesRoute, {
        from: currentUser._id,
        to: currentChat._id,
      });
      return res;
    }
    currentChat &&
      getMessages().then((res) => {
        setMessages(res.data);
      });
  }, [currentChat, currentUser]);

  const handleSendMsg = async (message) => {
    await axios.post(sendMessageRoute, {
      from: currentUser._id,
      to: currentChat._id,
      message,
    });
    socket.current.emit("send-message", {
      to: currentChat._id,
      from: currentUser._id,
      message,
    });

    const msgs = [...messages];
    msgs.push({ fromSelf: true, message });
    setMessages(msgs);
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("message-received", (message) => {
        setArrivalMessage({ fromSelf: false, message });
      });
    }
  }, [socket]);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
              alt="avatar"
            />
          </div>
          <div className="username">
            <h3>{currentChat.username}</h3>
          </div>
        </div>
        <Logout />
      </div>
      <div className="chat-messages">
        {messages &&
          messages.map((message, index) => {
            return (
              <div ref={scrollRef} key={index}>
                <div
                  className={`message ${
                    message.fromSelf ? "sended" : "received"
                  }`}
                >
                  <div className="content">
                    <p>{message.message}</p>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: inherit;
  width: inherit;
  .chat-header {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 0.2rem 0.5rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        text-align: center;
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .received {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;
