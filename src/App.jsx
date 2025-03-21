import React, { useEffect, useState } from "react";
// import logo from "./logo.svg";
import "./App.css";
const API_URL = "https://api.frontendexpert.io/api/fe/wordle-words";

function App() {
  // const [array, setArray] = useState(Array(6).fill(null));
  const [gusses, setGusses] = useState(Array(6).fill(null));
  const [solution, setSolution] = useState("");
  const [currentGusses, setCurrentGusses] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);
  const [youLoose, setyouLoose] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(API_URL);
      const data = await response.json();
      const randomPic = data[Math.floor(Math.random() * data.length)];
      setSolution(randomPic);
      // console.log(randomPic);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleType = (event) => {
      if (isGameOver) return;
      if (gusses.findIndex((val) => val == null) === -1) {
        setyouLoose(true);
        return;
      }

      if (event.key === "Enter") {
        if (currentGusses.length !== 5) return;

        const isOver = currentGusses === solution;
        if (isOver) {
          setIsGameOver(true);
        }

        const newGusses = [...gusses];
        newGusses[gusses.findIndex((val) => val == null)] = currentGusses;
        setGusses(newGusses);
        setCurrentGusses("");
      }

      if (event.key === "Backspace") {
        setCurrentGusses(currentGusses.slice(0, -1));
        return;
      }

      if (currentGusses.length >= 5) {
        return;
      }

      const regex = /^[A-Z]$/;

      if (regex.test(event.key)) setCurrentGusses((prev) => prev + event.key);
    };
    window.addEventListener("keydown", handleType);

    return () => window.removeEventListener("keydown", handleType);
  }, [currentGusses]);

  return (
    <div className="board">
      {isGameOver && <h1>Youu guesses the word correct !!!</h1>}
      {youLoose && <h1>Reload the page to try again</h1>}
      {gusses.map((m, index) => {
        const isCurrentGusses =
          index === gusses.findIndex((val) => val == null);
        return (
          <Puzzle
            key={index}
            isFinal={!isCurrentGusses && m !== null}
            gusses={isCurrentGusses ? currentGusses : m ?? ""}
            solution={solution}
          />
        );
      })}
    </div>
  );
}
function Puzzle({ gusses, isFinal, solution }) {
  const tiles = [];

  for (let i = 0; i < 5; i++) {
    // console.log(solution);
    const charc = gusses[i];
    let classname = "tile";

    if (isFinal) {
      if (charc === solution[i]) {
        classname += " correct";
      } else if (solution.includes(charc)) {
        classname += " partial";
      } else {
        classname += " wrong";
      }
    }
    // console.log(classname);
    tiles.push(
      <div key={i} className={classname}>
        {charc}
      </div>
    );
  }

  return <div className="line"> {tiles} </div>;
}

export default App;
