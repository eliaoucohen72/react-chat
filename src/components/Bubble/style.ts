const message = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  padding: "10px",
  borderRadius: "10px",
  maxWidth: "70%",
  float: "right",
  clear: "both",
  overflowWrap: 'break-word'
};

const style = {
  wrapper: {
    display: "block",
    clear: "both",
    marginBottom: "10px",
    padding: "10px 0",
  },
  username: {
    fontSize: "12px",
    fontWeight: 700,
  },
  outgoingMessage: {
    ...message,
    float: "right",
  },
  incomingMessage: {
    ...message,
    float: "left",
  },
  check: {
    width: "10px",
    float: "right",
  },
};
export default style;
