import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

import {
  SOCKET_CLIENT_EVENT,
  SOCKET_SERVER_EVENT,
  SOCKET_SERVER_URL,
} from "./constants";
import InputArea from "./components/InputArea/InputArea";
import { Message } from "./interface";
import Bubble from "./components/Bubble/Bubble";
import Login from "./components/Login/Login";
import Logged from "./components/Logged/Logged";
import Ip from "./components/Ip/Ip";

function App() {
  const [ip, setIp] = useState("");
  const [username, setUsername] = useState("");
  const [tempUsername, setTempUsername] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);

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

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => {
        setIp(data.ip);
      });
  }, []);

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

  const sendMessage = () => {
    if (socket) {
      if (file) {
        // upload to image server
      }
      const msg: Message = {
        username,
        message,
        ip,
      };
      socket.emit(SOCKET_CLIENT_EVENT, msg);
      setMessage("");
    }
  };

  return (
    <>
      <Ip ip={ip} />
      {!username ? (
        <Login
          onChangeTempUsername={onChangeTempUsername}
          onKeyDownUsername={onKeyDownUsername}
          saveUsername={saveUsername}
          tempUsername={tempUsername}
        />
      ) : (
        <>
          <Logged resetUsername={resetUsername} username={username} />
          <InputArea
            message={message}
            setFile={setFile}
            setMessage={setMessage}
            sendMessage={sendMessage}
          />
          {messages.map((msg: Message, index: number) => (
            <Bubble
              key={index}
              index={index}
              msg={msg}
              username={username}
              socket={socket}
            />
          ))}
        </>
      )}
    </>
  );
}

export default App;
