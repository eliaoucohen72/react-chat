import { SetStateAction } from "react";

export interface Context {
  isCalling: boolean;
  setIsCalling: React.Dispatch<SetStateAction<boolean>>;
}

export interface Message {
  username: string;
  message: string;
  ip: string;
}

export interface PeerMessage {
  peerId: string;
}

export interface SignalData {
  from: string;
  signal: unknown;
}
