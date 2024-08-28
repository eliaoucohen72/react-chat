const style = {
  inputWrapper: {
    display: "flex",
    gap: "10px",
    width: "100%",
  },
  input: {
    flex: 1,
    height: "40px",
    borderRadius: "5px",
    fontSize: "16px",
    width: "100%",
  },
  button: (disabled: boolean) => ({
    cursor: disabled ? "not-allowed" : "pointer",
    color: "black",
    padding: "10px 20px",
    borderRadius: "10px",
    fontSize: "16px",
  }),
};
export default style;
