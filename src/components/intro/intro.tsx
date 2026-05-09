import "./intro.css";

interface IntroProps {
  onStart: () => void;
}

const Intro = ({ onStart }: IntroProps) => {
  return (
    <div className="intro">
      <h1 className="intro-title">Special present for my special Bebas 🥰</h1>
      <div className="intro-center">
        <button className="unwrap-btn" onClick={onStart}>
          Unwrap ✨
        </button>
        <p className="intro-byline">made with love by your Bebas 🙂</p>
      </div>
    </div>
  );
};

export default Intro;
