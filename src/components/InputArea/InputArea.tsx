import { memo, SetStateAction } from "react";
import style from "./style";
// import attach from "../../assets/attach.png";
import { css } from "../../utils";

interface InputAreaProps {
  message: string;
  sendMessage: () => void;
  setMessage: React.Dispatch<SetStateAction<string>>;
  setFile: React.Dispatch<SetStateAction<File | null>>;
}

const InputArea = ({
  message,
  sendMessage,
  setMessage,
  // setFile,
}: InputAreaProps) => {
  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files) {
  //     setFile(e.target.files[0]);
  //   }
  // };

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
        {/* <div style={css(style.attach)}>
          <label style={style.pointer}>
            <input hidden type="file" onChange={handleFileChange} />
            <img style={style.w20} src={attach} alt="" />
          </label>
        </div> */}
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
        send
      </button>
    </div>
  );
};

export default memo(InputArea);
