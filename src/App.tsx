import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

import { SOCKET_SERVER_EVENT, SOCKET_SERVER_URL } from "./constants";
import InputArea from "./components/InputArea";
import { Message } from "./interface";
import Bubble from "./components/Bubble";
import Login from "./components/Login";
import Logged from "./components/Logged";

function App() {
  const [username, setUsername] = useState("");
  const [tempUsername, setTempUsername] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    newSocket.on(SOCKET_SERVER_EVENT, (msg: Message) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    const sessionStorageUsername = sessionStorage.getItem("username");
    if (sessionStorageUsername && !username) {
      setUsername(sessionStorageUsername);
    }
  }, [username]);

  const onChangeTempUsername = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTempUsername(e.target.value);

  const onKeyDownUsername = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (!tempUsername) {
        alert("You have to enter an username");
      } else {
        saveUsername();
      }
    }
  };

  const saveUsername = () => {
    setUsername(tempUsername);
    sessionStorage.setItem("username", tempUsername);
  };

  const resetUsername = () => {
    sessionStorage.setItem("username", "");
    setUsername("");
  };

  return !username ? (
    <Login
      onChangeTempUsername={onChangeTempUsername}
      onKeyDownUsername={onKeyDownUsername}
      saveUsername={saveUsername}
      tempUsername={tempUsername}
    />
  ) : (
    <>
      <Logged resetUsername={resetUsername} username={username} />
      <InputArea socket={socket} username={username} />
      {messages.map((msg: Message, index: number) => (
        <Bubble index={index} msg={msg} username={username} />
      ))}
    </>
  );
}

export default App;
