import { useState, useRef, useEffect, memo } from "react";

function VoiceCall({ socket }: { socket: any; }) {
  const [isCalling, setIsCalling] = useState(false);
  const [receiverIp, setReceiverIp] = useState("");
  const localAudioRef = useRef<HTMLAudioElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    socket.on("offer", async (data: { sdp: any; ip: string }) => {
      if (data.ip === receiverIp) {
        await handleOffer(data.sdp);
      }
    });

    socket.on("answer", async (data: { sdp: any; ip: string }) => {
      if (data.ip === receiverIp) {
        await handleAnswer(data.sdp);
      }
    });

    socket.on("ice-candidate", (data: { candidate: any; ip: string }) => {
      if (data.ip === receiverIp && peerConnectionRef.current) {
        peerConnectionRef.current.addIceCandidate(
          new RTCIceCandidate(data.candidate)
        );
      }
    });

    return () => {
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
    };
  }, [socket, receiverIp]);

  const startCall = async () => {
    if (!receiverIp) {
      alert("Please enter the receiver's IP address");
      return;
    }

    peerConnectionRef.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
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

    socket.emit("offer", { sdp: offer, ip: receiverIp });
    setIsCalling(true);
  };

  const handleOffer = async (offer: RTCSessionDescriptionInit) => {
    if (!peerConnectionRef.current) {
      startCall();
    }

    await peerConnectionRef.current?.setRemoteDescription(
      new RTCSessionDescription(offer)
    );

    const answer = await peerConnectionRef.current?.createAnswer();
    await peerConnectionRef.current?.setLocalDescription(answer);

    socket.emit("answer", { sdp: answer, ip: receiverIp });
  };

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
      <input
        type="text"
        placeholder="Enter Receiver's IP Address"
        value={receiverIp}
        onChange={(e) => setReceiverIp(e.target.value)}
      />
      <button onClick={startCall} disabled={isCalling}>
        Start Call
      </button>
      <button onClick={hangUp} disabled={!isCalling}>
        Hang Up
      </button>
      <audio ref={localAudioRef} autoPlay muted />
      <audio ref={remoteAudioRef} autoPlay />
    </div>
  );
}

export default memo(VoiceCall);
