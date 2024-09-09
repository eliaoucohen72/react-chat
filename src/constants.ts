export const SOCKET_SERVER_URL =
  process.env.NODE_ENV === "production"
    ? import.meta.env.PRODUCTION_SERVER_URL
    : "http://localhost:8080";

export const SOCKET_SERVER_EVENT = "SERVER_MSG";

export const SOCKET_CLIENT_EVENT = "CLIENT_MSG";
