import { useState, useRef, useEffect, memo, useCallback } from "react";
import callIcon from "../../assets/call.png";
import hangUpIcon from "../../assets/hangUp.png";
import { Socket } from "socket.io-client";

interface VoiceCallProps {
  socket: Socket | null;
  receiverIp: string;
}

function VoiceCall({ socket, receiverIp }: VoiceCallProps) {
  const [isCalling, setIsCalling] = useState(false);
  const localAudioRef = useRef<HTMLAudioElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  const startCall = useCallback(async () => {
    if (!receiverIp) {
      alert("Please enter the receiver's IP address");
      return;
    }

    peerConnectionRef.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.emit("ice-candidate", {
          candidate: event.candidate,
          ip: receiverIp,
        });
      }
    };

    peerConnectionRef.current.ontrack = (event) => {
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = event.streams[0];
      }
    };

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    if (localAudioRef.current) {
      localAudioRef.current.srcObject = stream;
    }

    stream.getTracks().forEach((track) => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.addTrack(track, stream);
      }
    });

    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);

    socket?.emit("offer", { sdp: offer, ip: receiverIp });
    setIsCalling(true);
  }, [receiverIp, socket]);

  const handleOffer = useCallback(
    async (offer: RTCSessionDescriptionInit) => {
      if (!peerConnectionRef.current) {
        startCall();
      }

      await peerConnectionRef.current?.setRemoteDescription(
        new RTCSessionDescription(offer)
      );

      const answer = await peerConnectionRef.current?.createAnswer();
      await peerConnectionRef.current?.setLocalDescription(answer);

      socket?.emit("answer", { sdp: answer, ip: receiverIp });
    },
    [receiverIp, socket, startCall]
  );

  useEffect(() => {
    socket?.on(
      "offer",
      async (data: { sdp: RTCSessionDescriptionInit; ip: string }) => {
        if (data.ip === receiverIp) {
          await handleOffer(data.sdp);
        }
      }
    );

    socket?.on(
      "answer",
      async (data: { sdp: RTCSessionDescriptionInit; ip: string }) => {
        if (data.ip === receiverIp) {
          await handleAnswer(data.sdp);
        }
      }
    );

    socket?.on(
      "ice-candidate",
      (data: { candidate: RTCIceCandidateInit; ip: string }) => {
        if (data.ip === receiverIp && peerConnectionRef.current) {
          peerConnectionRef.current.addIceCandidate(
            new RTCIceCandidate(data.candidate)
          );
        }
      }
    );

    return () => {
      socket?.off("offer");
      socket?.off("answer");
      socket?.off("ice-candidate");
    };
  }, [socket, receiverIp, handleOffer]);

  const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
    await peerConnectionRef.current?.setRemoteDescription(
      new RTCSessionDescription(answer)
    );
  };

  const hangUp = () => {
    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;
    setIsCalling(false);
  };

  return (
    <div>
      <button>
        <img
          onClick={startCall}
          style={{ width: "20px" }}
          src={callIcon}
          alt=""
        />
      </button>
      <button onClick={hangUp} disabled={!isCalling}>
        <img style={{ width: "20px" }} src={hangUpIcon} alt="" />{" "}
      </button>
      <audio ref={localAudioRef} autoPlay muted />
      <audio ref={remoteAudioRef} autoPlay />
    </div>
  );
}

export default memo(VoiceCall);
