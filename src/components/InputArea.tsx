import { memo, useState } from "react";
import style from "../style";
import attach from "../assets/attach.png";
import { SOCKET_CLIENT_EVENT } from "../constants";
import { Socket } from "socket.io-client";
import {Message} from "../interface";

interface InputAreaProps {
  socket: Socket | null;
  username: string
}

const InputArea = ({ socket, username }: InputAreaProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const onChangeMessage = (e: React.ChangeEvent<HTMLInputElement>) =>
    setMessage(e.target.value);

  const sendMessage = async (
    e:
      | React.KeyboardEvent<HTMLInputElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (socket) {
      if (file) {
        // upload to image server
      }
      const msg: Message = {
        username,
        message,
      };
      socket.emit(SOCKET_CLIENT_EVENT, msg);
      setMessage("");
    }
  };

  const onKeyDownMessage = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage(e);
    }
  };

  return (
    <div style={style.inputWrapper}>
      <div style={{ position: "relative", flex: 1 }}>
        <div
          style={{
            width: "20px",
            height: "20px",
            position: "absolute",
            top: "15px",
            right: 0,
          }}
        >
          <label style={{ cursor: "pointer" }}>
            <input hidden type="file" onChange={handleFileChange} />
            <img style={{ width: "20px" }} src={attach} alt="" />
          </label>
        </div>
        <input
          style={style.input}
          value={message}
          onKeyDown={onKeyDownMessage}
          onChange={onChangeMessage}
          placeholder="Your message"
        />
      </div>
      <button style={style.button} onClick={sendMessage}>
        send
      </button>
    </div>
  );
};

export default memo(InputArea);
