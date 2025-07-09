import { useState, useEffect, useContext } from "react";
import { io, Socket } from "socket.io-client";

import InputArea from "./components/InputArea/InputArea";
import { Message } from "./interface";
import Bubble from "./components/Bubble/Bubble";
import Ip from "./components/Ip/Ip";
import { AppContextProvider } from "./context";
import Logged from "./components/Logged/Logged";
import { AppContext } from "./context";

const { VITE_SERVER_URL } = import.meta.env;

function App() {
  const [ip, setIp] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState("");
  const { username, setUsername } = useContext(AppContext);
  const [nicknameInput, setNicknameInput] = useState("");

  useEffect(() => {
    const newSocket = io(VITE_SERVER_URL);
    setSocket(newSocket);

    newSocket.on("SERVER_MSG", (msg: Message) => {
      console.log(msg);

      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  if (!username) {
    return (
      <div className="chat-container" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', maxWidth: 400, margin: 'auto'}}>
        <h2>Welcome to the chat!</h2>
        <p>Choose a nickname to start:</p>
        <input
          type="text"
          value={nicknameInput}
          onChange={e => setNicknameInput(e.target.value)}
          placeholder="Your nickname..."
          style={{padding: '10px', fontSize: '1rem', borderRadius: 8, border: '1px solid #ccc', width: '100%', marginBottom: 16}}
          autoFocus
          maxLength={20}
        />
        <button
          style={{padding: '10px 24px', fontSize: '1rem', borderRadius: 8, background: '#4a6fa1', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600, width: '100%'}}
          disabled={!nicknameInput.trim()}
          onClick={() => setUsername(nicknameInput.trim())}
        >
          Enter the chat
        </button>
      </div>
    );
  }

  const sendMessage = () => {
    if (socket) {
      const msg: Message = {
        username, // Utilise le pseudo choisi
        message,
        ip,
      };
      socket.emit("CLIENT_MSG", msg);
      setMessage("");
    }
  };

  const resetUsername = () => {
    setUsername("");
  };

  return (
    <AppContextProvider>
      <div className="chat-container" style={{display: 'flex', flexDirection: 'column', height: '80vh', maxHeight: 700}}>
        <Logged />
        <div style={{flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 0}}>
          <Ip ip={ip} setIp={setIp} />
          {messages.map((msg: Message, index: number) => (
            <Bubble key={index} index={index} msg={msg} ip={ip} />
          ))}
        </div>
        <InputArea
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
    </AppContextProvider>
  );
}

export default App;
