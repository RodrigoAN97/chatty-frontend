import "./App.css";
import io from "socket.io-client";
import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";

const socket = io("http://localhost:8000");
const userName = nanoid(5);

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendChat = (e) => {
    e.preventDefault();
    socket.emit("chat", { message, userName });
    setMessage("");
  };

  useEffect(() => {
    socket.on("chat", (payload) => {
      setChat([...chat, payload]);
    });
  });

  return (
    <div className="App">
      <header className="App-header">
        <h1>My Chat</h1>
        {chat.map((payload, index) => {
          return <p key={index}>{payload.userName}: {payload.message}</p>;
        })}
        <form onSubmit={sendChat}>
          <input
            type="text"
            name="chat"
            placeholder="send text"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          ></input>
          <button type="submit">Send</button>
        </form>
      </header>
    </div>
  );
}

export default App;
