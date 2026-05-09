import { useEffect } from "react";
import confetti from "canvas-confetti";
import oiiai from "../../assets/oiiai.gif";
import happyCat from "../../assets/happy_cat.gif";
import birthdayHat from "../../assets/birthday_hat.webp";
import "./mainHub.css";

const COLORS = ["#C0172B", "#D4AF37", "#F2A0A8", "#FFF5F5", "#7A0E1A"];

type View = "intro" | "mainHub" | "congrats";

interface MainHubProps {
  onNavigate: (view: View) => void;
}

const MainHub = ({ onNavigate }: MainHubProps) => {
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
    <div className="main-hub">
      <img src={birthdayHat} alt="" className="hat-top-left" />
      <img src={birthdayHat} alt="" className="hat-top-right" />
      <img src={oiiai} alt="oiiai cat" className="oiiai-corner" />
      <img src={happyCat} alt="happy cat" className="happy-cat-corner" />
      <h1 className="hub-title">Happy Birthday Bebas 🎂✨</h1>
      <div className="hub-buttons">
        <button className="hub-btn">Message 💌</button>
        <button className="hub-btn">Photos 📸</button>
        <button className="hub-btn">Music 🎵</button>
        <button className="hub-btn" onClick={() => onNavigate("congrats")}>
          Surprise 🎁
        </button>
      </div>
    </div>
  );
};

export default MainHub;
