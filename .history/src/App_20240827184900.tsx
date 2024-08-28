import { useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);

  function setNewMessage(msg) {
    setMessages([
      ...messages,
      msg
    ]);
  }
  return <div>hi</div>;
}

export default App;
