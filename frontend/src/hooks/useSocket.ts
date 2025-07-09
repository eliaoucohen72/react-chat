import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Message } from "../interface";

export function useSocket(serverUrl: string) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Load message history
    fetch(`${serverUrl.replace(/\/$/, "")}/api/messages`)
      .then((res) => res.json())
      .then((data) => setMessages(data));

    const newSocket = io(serverUrl);
    setSocket(newSocket);

    newSocket.on("SERVER_MSG", (msg: Message) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
      if (document.visibilityState !== "visible") {
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification(`New message from ${msg.username}`, { body: msg.message });
        }
      }
    });

    // Patch: add a timestamp when sending
    const originalEmit = newSocket.emit.bind(newSocket);
    newSocket.emit = (event, data) => {
      if (event === "CLIENT_MSG" && data && !data.timestamp) {
        data.timestamp = new Date().toISOString();
      }
      return originalEmit(event, data);
    };

    return () => {
      newSocket.close();
    };
  }, [serverUrl]);

  // Request notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  return { socket, messages, setMessages };
} 