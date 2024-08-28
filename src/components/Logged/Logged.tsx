import { memo } from "react";
import style from "./style";

interface LoggedProps {
  username: string;
  resetUsername: React.MouseEventHandler<HTMLSpanElement> | undefined;
}

const Logged = ({ username, resetUsername }: LoggedProps) => {
  return (
    <div style={style.wrapper}>
      You are logged in as <span style={style.username}>{username}</span>. Click{" "}
      <span style={style.resetUsername} onClick={resetUsername}>
        here
      </span>{" "}
      to reset your username
    </div>
  );
};

export default memo(Logged);
