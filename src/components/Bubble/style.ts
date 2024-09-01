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
  message: (outgoing: boolean, backgroundColor: string) => ({
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "10px",
    borderRadius: "10px",
    maxWidth: "70%",
    float: outgoing ? "right" : "left",
    clear: "both",
    overflowWrap: "break-word",
    backgroundColor
  }),
  check: {
    width: "10px",
    float: "right",
  },
};
export default style;
