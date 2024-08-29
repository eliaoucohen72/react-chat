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

