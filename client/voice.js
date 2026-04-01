import { socket } from "./network.js";

let peer;

export async function startVoice() {
  peer = new RTCPeerConnection();

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  stream.getTracks().forEach(track => peer.addTrack(track, stream));

  peer.ontrack = (e) => {
    const audio = document.createElement("audio");
    audio.srcObject = e.streams[0];
    audio.play();
  };
}