import { useState, useRef, useEffect, memo, useCallback } from "react";
import { Socket } from "socket.io-client";
import callIcon from "../../assets/call.png";
import style from "./style";
import hangUpIcon from "../../assets/hangUp.png";

interface VoiceCallProps {
  socket: Socket | null;
  receiverIp: string;
}

function VoiceCall({ socket, receiverIp }: VoiceCallProps) {
  const [isCalling, setIsCalling] = useState(false);
  const localAudioRef = useRef<HTMLAudioElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  const initializePeerConnection = useCallback(() => {
    if (peerConnectionRef.current) return;

    peerConnectionRef.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("Sending ICE candidate", event.candidate);
        socket?.emit("ice-candidate", {
          candidate: event.candidate,
          ip: receiverIp,
        });
      }
    };

    peerConnectionRef.current.ontrack = (event) => {
      console.log("Received remote track", event.streams);
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = event.streams[0];
        console.log(
          "Remote audio stream set:",
          remoteAudioRef.current.srcObject
        );
      }
    };

    peerConnectionRef.current.onconnectionstatechange = () => {
      console.log(
        "Connection state change:",
        peerConnectionRef.current?.connectionState
      );
    };

    peerConnectionRef.current.oniceconnectionstatechange = () => {
      console.log(
        "ICE Connection State:",
        peerConnectionRef.current?.iceConnectionState
      );
    };
  }, [receiverIp, socket]);

  const startCall = useCallback(async () => {
    initializePeerConnection();

    if (peerConnectionRef.current) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => {
        console.log("Track kind:", track.kind);
      });

      console.log("Local stream obtained", stream);
      if (localAudioRef.current) {
        localAudioRef.current.srcObject = stream;
      }

      stream.getTracks().forEach((track) => {
        if (peerConnectionRef.current) {
          peerConnectionRef.current.addTrack(track, stream);
          console.log("Track added:", track);
        }
      });

      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);

      console.log("Sending offer", offer);
      socket?.emit("offer", { sdp: offer, ip: receiverIp });
      setIsCalling(true);
    }
  }, [initializePeerConnection, receiverIp, socket]);

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

      console.log("Sending answer", answer);
      socket?.emit("answer", { sdp: answer, ip: receiverIp });
    },
    [receiverIp, socket, startCall]
  );

  useEffect(() => {
    socket?.on(
      "offer",
      async (data: { sdp: RTCSessionDescriptionInit; ip: string }) => {
        if (data.ip === receiverIp) {
          console.log("Received offer", data.sdp);
          await handleOffer(data.sdp);
        }
      }
    );

    socket?.on(
      "answer",
      async (data: { sdp: RTCSessionDescriptionInit; ip: string }) => {
        if (data.ip === receiverIp) {
          console.log("Received answer", data.sdp);
          await handleAnswer(data.sdp);
        }
      }
    );

    socket?.on("ice-candidate", (data) => {
      if (data.ip === receiverIp && peerConnectionRef.current) {
        console.log("Received ICE candidate", data.candidate);
        peerConnectionRef.current.addIceCandidate(
          new RTCIceCandidate(data.candidate)
        );
      }
    });

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
    console.log("Hanging up");
    if (peerConnectionRef.current) {
      peerConnectionRef.current
        .getSenders()
        .forEach((sender) => sender.track?.stop());
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (localAudioRef.current && localAudioRef.current.srcObject) {
      (localAudioRef.current.srcObject as MediaStream)
        .getTracks()
        .forEach((track) => track.stop());
    }
    setIsCalling(false);
  };

  return (
    <div style={style.wrapper}>
      <button style={style.action} onClick={startCall} disabled={isCalling}>
        <img style={{ width: "20px" }} src={callIcon} alt="Call" />
      </button>
      <button style={style.action} onClick={hangUp} disabled={!isCalling}>
        <img style={{ width: "20px" }} src={hangUpIcon} alt="Hang Up" />
      </button>
      <audio ref={localAudioRef} autoPlay muted />
      <audio ref={remoteAudioRef} autoPlay />
    </div>
  );
}

export default memo(VoiceCall);
