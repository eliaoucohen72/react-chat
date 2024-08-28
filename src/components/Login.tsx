import { memo } from "react";
import style from "../style";

interface LoginProps {
  tempUsername: string;
  onKeyDownUsername: React.KeyboardEventHandler<HTMLInputElement> | undefined;
  onChangeTempUsername: React.ChangeEventHandler<HTMLInputElement> | undefined;
  saveUsername: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

const Login = ({
  tempUsername,
  onKeyDownUsername,
  onChangeTempUsername,
  saveUsername,
}: LoginProps) => {
  return (
    <div style={style.inputWrapper}>
      <input
        style={style.input}
        value={tempUsername}
        onKeyDown={onKeyDownUsername}
        onChange={onChangeTempUsername}
        placeholder="Your username"
      />
      <button
        style={style.button}
        disabled={!tempUsername.trim()}
        onClick={saveUsername}
      >
        OK
      </button>
    </div>
  );
};

export default memo(Login);
