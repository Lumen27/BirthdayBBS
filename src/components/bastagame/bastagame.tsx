import React, { useEffect, useRef, useState } from "react";
import "./bastagame.css";

interface BastagameProps {
  onBack: () => void;
}

const FLOOR = 300;
const CHAR_W = 28;
const CHAR_H = 80;

// Inverse of rotateX(60deg) rotateZ(45deg):
// screen_x = 0.707*(localX - localY)
// screen_y = 0.354*(localX + localY)
// → localX = screenX*0.707 + screenY*1.414
// → localY = screenY*1.414 - screenX*0.707
const toLocal = (dx: number, dy: number) => ({
  x: dx * 0.707 + dy * 1.414,
  y: dy * 1.414 - dx * 0.707,
});

const Bastagame = ({ onBack }: BastagameProps) => {
  const [pos, setPos] = useState({ x: 130, y: 130 });
  const drag = useRef<{ mx: number; my: number; px: number; py: number } | null>(null);

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    drag.current = { mx: e.clientX, my: e.clientY, px: pos.x, py: pos.y };
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!drag.current) return;
      const { x, y } = toLocal(
        e.clientX - drag.current.mx,
        e.clientY - drag.current.my,
      );
      setPos({
        x: Math.max(0, Math.min(FLOOR - CHAR_W, drag.current.px + x)),
        y: Math.max(0, Math.min(FLOOR - CHAR_H, drag.current.py + y)),
      });
    };
    const onUp = () => { drag.current = null; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  return (
    <div className="basta-page">
      <h1 className="basta-title">Basta game 😾</h1>
      <div className="basta-area">
        <div className="kek">
          <div className="scene">
            <div className="room">
              <div className="floor" />
              <div className="wall-left" />
              <div className="wall-right" />
              <div
                className="character"
                style={{ left: pos.x, top: pos.y }}
                onMouseDown={onMouseDown}
              />
            </div>
          </div>
        </div>

        <div className="basta-bottom">
          <div className="basta-bottom-main" />
          <div className="basta-bottom-side" />
        </div>
      </div>
      <button className="basta-back-btn" onClick={onBack}>
        Back to menu
      </button>
    </div>
  );
};

export default Bastagame;
