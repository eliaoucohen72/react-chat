import { memo, useContext } from "react";
import style from "./style";
import { AppContext } from "../../context";

const Logged: React.FC = () => {
  const { username, setUsername } = useContext(AppContext);
  if (!username) return null;
  return (
    <div style={style.wrapper}>
      You are logged in as <span style={style.username}>{username}</span>. Click {" "}
      <span style={style.resetUsername} onClick={() => setUsername("")}>
        here
      </span>{" "}
      to reset your nickname
    </div>
  );
};

export default memo(Logged);
