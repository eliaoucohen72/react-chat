import { useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);

  function setNewMessage(msg) {
    setMessages([...messages, msg]);
  }

  function sendMessage(e) {
    e.preventDefault();
    const msg = {
      username: e.target.username.value,
      text: e.target.text.value,
    };
    setNewMessage(msg);
  }

  return <div>hi</div>;
}

export default App;
