import runningCat from "./assets/running_cat.jpg";
import "./App.css";

const colors = [
  { name: "Mint", description: "Yours", hex: "#ADEBB3" },
  { name: "Lavender", description: "Dreamy purple", hex: "#C9B8E8" },
  { name: "Blush", description: "Soft pink", hex: "#F4B8C8" },
  { name: "Sky", description: "Pastel blue", hex: "#B8D8ED" },
  { name: "Star", description: "Warm yellow", hex: "#FAE5A0" },
  { name: "Cream", description: "Off-white bg", hex: "#FEF9F2" },
  { name: "Ink", description: "Deep navy (text)", hex: "#2C3566" },
];

function App() {
  return (
    <>
      <div className="cat-section">
        <img src={runningCat} alt="Running cat" className="cat-img" />
      </div>
      <div>
        <button>123312</button>
      </div>
      <div className="palette">
        {colors.map((color) => (
          <div key={color.hex} className="swatch">
            <div className="square" style={{ background: color.hex }} />
            <p className="swatch-name">{color.name}</p>
            <p className="swatch-desc">{color.description}</p>
            <p className="swatch-hex">{color.hex}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
