import { useState } from "react";
import "./App.css";
import Intro from "./components/intro/intro";
import MainHub from "./components/mainHub/mainHub";
import Congrats from "./components/congrats/congrats";

type View = "intro" | "mainHub" | "congrats";

function App() {
  const [view, setView] = useState<View>("intro");
  const [camStream, setCamStream] = useState<MediaStream | null>(null);

  const handleStart = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      setCamStream(stream);
    } catch {
      // permission denied — continue without cam
    }
    setView("mainHub");
  };

  if (view === "intro") return <Intro onStart={handleStart} />;
  if (view === "congrats") return <Congrats stream={camStream} onBack={() => setView("mainHub")} />;
  return <MainHub onNavigate={setView} />;
}

export default App;
