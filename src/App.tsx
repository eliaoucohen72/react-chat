import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import check from "./assets/check.png";

const SOCKET_SERVER_URL =
  process.env.NODE_ENV === "production"
    ? "https://elc-react-chat.up.railway.app"
    : "http://localhost:8080";
const SOCKET_SERVER_EVENT = "SERVER_MSG";
const SOCKET_CLIENT_EVENT = "CLIENT_MSG";

interface Message {
  username: string;
  message: string;
}

const getColorFromUsername = (username: string) => {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 70%, 80%)`; // Une teinte en HSL
  return color;
};

function App() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
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
    // Ajout d'un identifiant unique à la fenêtre
    const windowId = sessionStorage.getItem("windowId") || `user_${Date.now()}`;
    sessionStorage.setItem("windowId", windowId);

    // On inclut cet identifiant dans le username
    setUsername(windowId);
  }, []);

  const sendMessage = (
    e:
      | React.KeyboardEvent<HTMLInputElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (socket) {
      const msg: Message = {
        username,
        message,
      };
      socket.emit(SOCKET_CLIENT_EVENT, msg);
      setMessage("");
    }
  };

  const onChangeMessage = (e: React.ChangeEvent<HTMLInputElement>) =>
    setMessage(e.target.value);

  const onKeyDownMessage = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage(e);
    }
  };

  return (
    <>
      <div className="inputWrapper">
        <input
          value={message}
          onKeyDown={onKeyDownMessage}
          onChange={onChangeMessage}
          placeholder="Your message"
        />
        <button onClick={sendMessage}>send</button>
      </div>
      {messages.map((msg: Message, index: number) => {
        const color = getColorFromUsername(msg.username);

        return (
          <div key={index} className="message">
            <div
              className={
                msg.username === username
                  ? "outgoingMessage"
                  : "incomingMessage"
              }
              style={{ backgroundColor: color }}
            >
              <div className="username">{msg.username}</div>
              <div>{msg.message}</div>
              <img className="check" src={check} alt="" />
            </div>
          </div>
        );
      })}
    </>
  );
}

export default App;
