import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import birthdayVideo from "../../assets/birthday_video.MP4";
import "./congrats.css";

const COLORS = ["#C0172B", "#D4AF37", "#F2A0A8", "#FFF5F5", "#7A0E1A"];

interface CongratsProps {
  stream: MediaStream | null;
  onBack: () => void;
}

const Congrats = ({ stream, onBack }: CongratsProps) => {
  const webcamRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoEl = webcamRef.current;
    if (videoEl && stream) {
      videoEl.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    confetti({
      particleCount: 120,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 1 },
      colors: COLORS,
      startVelocity: 65,
    });
    confetti({
      particleCount: 120,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 1 },
      colors: COLORS,
      startVelocity: 65,
    });

    const interval = setInterval(() => {
      confetti({
        particleCount: 4,
        angle: 270,
        spread: 160,
        origin: { x: Math.random(), y: 0 },
        colors: COLORS,
        ticks: 600,
        gravity: 1,
        startVelocity: 8,
        decay: 0.9,
        drift: Math.random() * 2 - 1,
      });
    }, 60);

    return () => {
      clearInterval(interval);
      confetti.reset();
    };
  }, []);

  return (
    <div className="congrats">
      <div className="congrats-scene">
        <p className="side-message message-left">Hat stolen, nooo 😭</p>
        <div className="video-wrapper">
          <video className="congrats-video" src={birthdayVideo} autoPlay playsInline />
          <video ref={webcamRef} className="webcam-overlay" autoPlay muted playsInline />
        </div>
        <p className="side-message message-right">Bro had to leave early 😢</p>
      </div>
      <button className="back-btn" onClick={onBack}>
        Back to menu
      </button>
    </div>
  );
};

export default Congrats;
