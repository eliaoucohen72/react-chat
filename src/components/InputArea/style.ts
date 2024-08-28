const style = {
  wrapper: {
    display: "flex",
    gap: "10px",
    width: "100%",
  },
  inputWrapper: {
    position: "relative",
    flex: 1,
  },
  attach: {
    width: "20px",
    height: "20px",
    position: "absolute",
    top: "15px",
    right: 0,
  },
  pointer: { cursor: "pointer" },
  w20: {
    width: "20px",
  },
  input: {
    flex: 1,
    height: "40px",
    borderRadius: "5px",
    fontSize: "16px",
    width: "100%",
  },
  button: (disabled: boolean)=> ({
    cursor: disabled ? 'not-allowed' : 'pointer',
    color: "black",
    padding: "10px 20px",
    borderRadius: "10px",
    fontSize: "16px",
  }),
};
export default style;
