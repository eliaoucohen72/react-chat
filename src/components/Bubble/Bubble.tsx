import { memo } from "react";

import style from "./style";
import { css, getColorFromUsername } from "../../utils/common";
import { Message } from "../../interface";
import check from "../../assets/check.png";

interface BubbleProps {
  index: number;
  msg: Message;
  ip: string;
}

const Bubble = ({ index, msg, ip }: BubbleProps) => {
  const backgroundColor = getColorFromUsername(msg.ip);
  const isOutgoingMessage = msg.ip === ip;

  return (
    <div key={index} style={css(style.wrapper)}>
      <div style={css(style.message(isOutgoingMessage, backgroundColor))}>
        <div style={style.username}>{msg.username}</div>
        <div>{msg.message}</div>
        <img style={css(style.check)} src={check} alt="" />
      </div>
    </div>
  );
};

export default memo(Bubble);
