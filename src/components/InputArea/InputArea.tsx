import { memo, SetStateAction } from "react";
import style from "./style";
import { css } from "../../utils/common";

interface InputAreaProps {
  message: string;
  sendMessage: () => void;
  setMessage: React.Dispatch<SetStateAction<string>>;
}

const InputArea = ({ message, sendMessage, setMessage }: InputAreaProps) => {
  const onChangeMessage = (e: React.ChangeEvent<HTMLInputElement>) =>
    setMessage(e.target.value);

  const _sendMessage = async (
    e:
      | React.KeyboardEvent<HTMLInputElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    sendMessage();
  };

  const onKeyDownMessage = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (message && e.key === "Enter") {
      _sendMessage(e);
    }
  };

  return (
    <div style={style.wrapper}>
      <div style={css(style.inputWrapper)}>
        <input
          style={style.input}
          value={message}
          onKeyDown={onKeyDownMessage}
          onChange={onChangeMessage}
          placeholder="Your message"
        />
      </div>
      <button
        disabled={!message}
        style={style.button(!message)}
        onClick={_sendMessage}
      >
        Send message
      </button>
    </div>
  );
};

export default memo(InputArea);
