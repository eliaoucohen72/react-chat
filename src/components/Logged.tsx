import { memo } from "react";

interface LoggedProps {
  username: string;
  resetUsername: React.MouseEventHandler<HTMLSpanElement> | undefined;
}

const Logged = ({ username, resetUsername }: LoggedProps) => {
  return (
    <div style={{ padding: "20px 0", fontSize: "20px" }}>
      You are logged in as {username}. Click{" "}
      <span style={{ color: "red", cursor: "pointer" }} onClick={resetUsername}>
        here
      </span>{" "}
      to reset your username
    </div>
  );
};

export default memo(Logged);
