import { memo } from "react";
import style from "./style";
import { css, getColorFromUsername } from "../../utils/common";
import { Message } from "../../interface";
import check from "../../assets/check.png";

interface BubbleProps {
  index: number;
  msg: Message;
  username: string;
}

const Bubble = ({ index, msg, username }: BubbleProps) => {
  const color = getColorFromUsername(msg.username);
  return (
    <div key={index} style={css(style.wrapper)}>
      <div
        style={
          msg.username === username
            ? css({ ...style.outgoingMessage, backgroundColor: color })
            : css({ ...style.incomingMessage, backgroundColor: color })
        }
      >
        <div style={style.username}>{msg.ip}</div>
        <div style={style.username}>{msg.username}</div>
        <div>{msg.message}</div>
        <img style={css(style.check)} src={check} alt="" />
      </div>
    </div>
  );
};

export default memo(Bubble);
