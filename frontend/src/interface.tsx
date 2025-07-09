import { SetStateAction } from "react";

export interface Context {
  isCalling: boolean;
  setIsCalling: React.Dispatch<SetStateAction<boolean>>;
}

export interface Message {
  nickname: string;
  message: string;
  ip: string;
  timestamp?: string;
}

export interface PeerMessage {
  peerId: string;
}

export interface SignalData {
  from: string;
  signal: unknown;
}
