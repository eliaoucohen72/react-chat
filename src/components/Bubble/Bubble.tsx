import { memo } from "react";
import style from "./style";
import { css, getColorFromUsername } from "../../utils/common";
import { Message } from "../../interface";
import check from "../../assets/check.png";

import VoiceCall from "../VoiceCall/VoiceCall";
import { Socket } from "socket.io-client";

interface BubbleProps {
  index: number;
  msg: Message;
  username: string;
  socket: Socket | null;
}

const Bubble = ({ index, msg, username, socket }: BubbleProps) => {
  const color = getColorFromUsername(msg.ip);
  return (
    <div key={index} style={css(style.wrapper)}>
      <div
        style={
          msg.username === username
            ? css({ ...style.outgoingMessage, backgroundColor: color })
            : css({ ...style.incomingMessage, backgroundColor: color })
        }
      >
        {/* <div style={style.username}>{msg.ip}</div> */}
        <div style={style.username}>{msg.username}</div>
        <div>{msg.message}</div>
        {msg.username !== username && (
          <VoiceCall socket={socket} receiverIp={msg.ip} />
        )}

        <img style={css(style.check)} src={check} alt="" />
      </div>
    </div>
  );
};

export default memo(Bubble);
