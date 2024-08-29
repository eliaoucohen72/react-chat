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
  socket: Socket | null;
  ip: string;
}

const Bubble = ({ index, msg, socket, ip }: BubbleProps) => {
  const color = getColorFromUsername(msg.ip);
  return (
    <div key={index} style={css(style.wrapper)}>
      <div
        style={
          msg.ip === ip
            ? css({ ...style.outgoingMessage, backgroundColor: color })
            : css({ ...style.incomingMessage, backgroundColor: color })
        }
      >
        {msg.ip !== ip && <VoiceCall socket={socket} receiverIp={msg.ip} />}
        <div style={style.username}>{msg.username}</div>
        <div>{msg.message}</div>

        <img style={css(style.check)} src={check} alt="" />
      </div>
    </div>
  );
};

export default memo(Bubble);
