import { type MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import stealsBalls from "../../assets/steals_balls.jpg";
import evilLarry from "../../assets/evil_larry.webp";
import explosionGif from "../../assets/explosion.gif";
import "./peenargame.css";

const GAME_W = 1000;
const PLAYER_X = 110;
const ENEMY_X = 50;
const PLAYER_SIZE = 40;
const OBS_W = 30;
const OBS_H = 50;
const GROUND_Y = 440;
const PLAYER_GROUND = GROUND_Y - PLAYER_SIZE;
const GRAVITY = 0.7;
const JUMP_VEL = -14;
const OBS_SPEED = 5;
const WIN_COUNT = 5;
const SPAWN_BASE = 90;
const CYLINDER_X = 600;
const CYLINDER_H = 150;
const ENTER_SPEED = 8;

interface Obs {
  id: number;
  x: number;
  passed: boolean;
}

type Phase = "idle" | "playing" | "entering" | "dead" | "won";

interface RenderSnap {
  playerTop: number;
  playerX: number;
  enemyX: number;
  obstacles: Obs[];
  cleared: number;
  cylinderVisible: boolean;
}

interface PeenargameProps {
  onBack: () => void;
}

const Peenargame = ({ onBack }: PeenargameProps) => {
  const [phase, setPhase] = useState<Phase>("idle");
  const [showExplosion, setShowExplosion] = useState(false);
  const [snap, setSnap] = useState<RenderSnap>({
    playerTop: PLAYER_GROUND,
    playerX: PLAYER_X,
    enemyX: ENEMY_X,
    obstacles: [],
    cleared: 0,
    cylinderVisible: false,
  });

  const playerTop = useRef(PLAYER_GROUND);
  const playerX = useRef(PLAYER_X);
  const enemyX = useRef(ENEMY_X);
  const velY = useRef(0);
  const obstacles = useRef<Obs[]>([]);
  const cleared = useRef(0);
  const spawnIn = useRef(SPAWN_BASE);
  const nextId = useRef(0);
  const cylinderVisible = useRef(false);
  const waitingToEnter = useRef(false);

  const resetRefs = () => {
    playerTop.current = PLAYER_GROUND;
    playerX.current = PLAYER_X;
    enemyX.current = ENEMY_X;
    velY.current = 0;
    obstacles.current = [];
    cleared.current = 0;
    spawnIn.current = SPAWN_BASE;
    nextId.current = 0;
    cylinderVisible.current = false;
    waitingToEnter.current = false;
  };

  const tryJump = useCallback(() => {
    if (playerTop.current >= PLAYER_GROUND - 2) {
      velY.current = JUMP_VEL;
    }
  }, []);

  const handleInput = useCallback(() => {
    if (phase === "idle") {
      resetRefs();
      setSnap({
        playerTop: PLAYER_GROUND,
        playerX: PLAYER_X,
        enemyX: ENEMY_X,
        obstacles: [],
        cleared: 0,
        cylinderVisible: false,
      });
      setPhase("playing");
    } else if (phase === "playing") {
      tryJump();
    }
  }, [phase, tryJump]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        handleInput();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleInput]);

  // Main game loop
  useEffect(() => {
    if (phase !== "playing") return;

    let raf: number;

    const loop = () => {
      // Player physics
      playerTop.current += velY.current;
      velY.current += GRAVITY;
      if (playerTop.current >= PLAYER_GROUND) {
        playerTop.current = PLAYER_GROUND;
        velY.current = 0;
      }

      // Move obstacles
      for (const o of obstacles.current) o.x -= OBS_SPEED;

      // Mark passed
      for (const o of obstacles.current) {
        if (!o.passed && o.x + OBS_W < PLAYER_X) {
          o.passed = true;
          cleared.current += 1;
        }
      }

      // Remove off-screen
      obstacles.current = obstacles.current.filter((o) => o.x + OBS_W > -20);

      // Show cylinder after 5th cleared
      if (cleared.current >= WIN_COUNT) cylinderVisible.current = true;

      // Once 5th is cleared, wait for player to land then enter
      if (cleared.current >= WIN_COUNT && !waitingToEnter.current) {
        waitingToEnter.current = true;
      }
      if (waitingToEnter.current && playerTop.current >= PLAYER_GROUND - 2) {
        setPhase("entering");
        return;
      }

      // Collision (skip once waiting to enter)
      if (!waitingToEnter.current) {
        const pBottom = playerTop.current + PLAYER_SIZE;
        const pRight = PLAYER_X + PLAYER_SIZE;
        const hit = obstacles.current.some((o) => {
          if (o.passed) return false;
          return (
            pRight > o.x &&
            PLAYER_X < o.x + OBS_W &&
            pBottom > GROUND_Y - OBS_H &&
            playerTop.current < GROUND_Y
          );
        });
        if (hit) { setPhase("dead"); return; }
      }

      // Spawn only up to WIN_COUNT total obstacles
      if (nextId.current < WIN_COUNT) {
        spawnIn.current -= 1;
        if (spawnIn.current <= 0) {
          obstacles.current.push({ id: nextId.current++, x: GAME_W, passed: false });
          spawnIn.current = SPAWN_BASE + Math.floor(Math.random() * 50);
        }
      }

      setSnap({
        playerTop: playerTop.current,
        playerX: PLAYER_X,
        enemyX: ENEMY_X,
        obstacles: obstacles.current.map((o) => ({ ...o })),
        cleared: cleared.current,
        cylinderVisible: cylinderVisible.current,
      });

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  // Entering animation: player + enemy walk into cylinder, then wait 1s and show thanks
  useEffect(() => {
    if (phase !== "entering") return;

    let raf: number;
    let running = true;
    let waitTimeout: ReturnType<typeof setTimeout>;

    const loop = () => {
      if (!running) return;
      playerX.current += ENTER_SPEED;
      enemyX.current += ENTER_SPEED;
      setSnap((prev) => ({
        ...prev,
        playerX: playerX.current,
        enemyX: enemyX.current,
      }));

      if (playerX.current >= CYLINDER_X) {
        waitTimeout = setTimeout(() => {
          setShowExplosion(true);
          setTimeout(() => setPhase("won"), 500);
        }, 0);
        return;
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      clearTimeout(waitTimeout);
    };
  }, [phase]);

  const handleRestart = (e: MouseEvent) => {
    e.stopPropagation();
    resetRefs();
    setShowExplosion(false);
    setPhase("idle");
  };

  return (
    <div className="peenar-page">
      <h1 className="peenar-title">Peenar game 😳</h1>
      <div className="peenar-game" onClick={handleInput}>
        <div className="peenar-ground" />

        {snap.cylinderVisible && (
          <div
            className="peenar-cylinder"
            style={{ left: CYLINDER_X, top: GROUND_Y - CYLINDER_H }}
          />
        )}

        {showExplosion && (
          <img
            src={explosionGif}
            className="peenar-explosion"
            alt=""
            style={{ left: CYLINDER_X, top: GROUND_Y - CYLINDER_H }}
          />
        )}

        <div className="peenar-enemy" style={{ top: PLAYER_GROUND, left: snap.enemyX }} />

        <div className="peenar-player" style={{ top: snap.playerTop, left: snap.playerX }}>
          <img src={stealsBalls} className="player-base" alt="" />
          <img src={evilLarry} className="player-overlay" alt="" />
        </div>

        {snap.obstacles.map((o) => (
          <div
            key={o.id}
            className="peenar-obstacle"
            style={{ left: o.x, top: GROUND_Y - OBS_H }}
          />
        ))}

        {phase === "playing" && (
          <div className="peenar-score">
            {snap.cleared} / {WIN_COUNT}
          </div>
        )}

        {phase === "idle" && (
          <div className="peenar-overlay">
            <p>click or press space to play</p>
          </div>
        )}

        {phase === "dead" && (
          <div className="peenar-overlay">
            <p>game over 💀</p>
            <button onClick={handleRestart}>try again</button>
          </div>
        )}

        {phase === "won" && (
          <div className="peenar-overlay">
            <p>thanks for playing! 🎉</p>
            <button onClick={handleRestart}>play again</button>
          </div>
        )}
      </div>
      <button className="peenar-back-btn" onClick={onBack}>
        Back to menu
      </button>
    </div>
  );
};

export default Peenargame;
