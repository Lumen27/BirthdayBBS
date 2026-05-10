import React, { useEffect, useRef, useState } from "react";
import idleImg from "../../assets/idle.png";
import "./bastagame.css";

interface BastagameProps {
  onBack: () => void;
}

const FLOOR = 300;
const CHAR_W = 84;
const CHAR_H = 240;
const SPEED = 1.2;
const X_MIN = 0,
  X_MAX = FLOOR - CHAR_W;
const Y_MIN = 0,
  Y_MAX = FLOOR - CHAR_H;
const REST_Y = -160;

const toLocal = (dx: number, dy: number) => ({
  x: dx * 0.707 + dy * 1.414,
  y: dy * 1.414 - dx * 0.707,
});

const randTarget = () => ({
  x: X_MIN + Math.random() * (X_MAX - X_MIN),
  y: Y_MIN + Math.random() * (Y_MAX - Y_MIN),
});

const atRest = (x: number, y: number) => x < 3 && y < -155;

const Bastagame = ({ onBack }: BastagameProps) => {
  const [pos, setPos] = useState({ x: 130, y: 130 });
  const posRef = useRef({ x: 130, y: 130 });
  const target = useRef(randTarget());
  const raf = useRef(0);
  const paused = useRef(false);
  const drag = useRef<{ mx: number; my: number; px: number; py: number } | null>(null);

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    paused.current = true;
    drag.current = { mx: e.clientX, my: e.clientY, px: posRef.current.x, py: posRef.current.y };
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!drag.current) return;
      const { x, y } = toLocal(e.clientX - drag.current.mx, e.clientY - drag.current.my);
      const nx = Math.max(0, Math.min(FLOOR, drag.current.px + x));
      const ny = Math.max(REST_Y, Math.min(FLOOR, drag.current.py + y));
      posRef.current = { x: nx, y: ny };
      setPos({ x: nx, y: ny });
    };

    const onUp = () => {
      if (!drag.current) return;
      drag.current = null;
      if (atRest(posRef.current.x, posRef.current.y)) {
        paused.current = true;
        return;
      }
      paused.current = false;
      target.current = randTarget();
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  useEffect(() => {
    const loop = () => {
      if (!paused.current) {
        const p = posRef.current;
        const t = target.current;
        const dx = t.x - p.x;
        const dy = t.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < SPEED) {
          target.current = randTarget();
        } else {
          const nx = p.x + (dx / dist) * SPEED;
          const ny = p.y + (dy / dist) * SPEED;
          posRef.current = { x: nx, y: ny };
          setPos({ x: nx, y: ny });
          if (atRest(nx, ny)) paused.current = true;
        }
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
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
              <img
                src={idleImg}
                alt=""
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
