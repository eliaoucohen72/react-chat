import { memo } from "react";

import style from "./style";
import { css, getColorFromUsername } from "../../utils/common";
import { Message } from "../../interface";

interface BubbleProps {
  index: number;
  msg: Message;
  ip: string;
}

function formatTime(dateStr?: string) {
  const d = dateStr ? new Date(dateStr) : new Date();
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const Bubble = ({ index, msg, ip }: BubbleProps) => {
  const backgroundColor = getColorFromUsername(msg.ip);
  const isOutgoingMessage = msg.ip === ip;
  const initial = msg.nickname?.[0]?.toUpperCase() || "?";
  return (
    <div style={style.wrapper}>
      {!isOutgoingMessage && (
        <div style={style.avatar}>{initial}</div>
      )}
      <div style={style.content(isOutgoingMessage, backgroundColor)}>
        <div style={style.username}>{msg.nickname}</div>
        <div>{msg.message}</div>
        <div style={style.timestamp}>{formatTime(msg.timestamp)}</div>
      </div>
      {isOutgoingMessage && (
        <div style={style.avatar}>{initial}</div>
      )}
    </div>
  );
};

export default memo(Bubble);
