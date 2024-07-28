import { useEffect, useState } from "react";
import blueCandy from './images/blue-candy.png'
import greenCandy from './images/green-candy.png'
import redCandy from './images/red-candy.png'
import orangeCandy from './images/orange-candy.png'
import yellowCandy from './images/yellow-candy.png'
import purpleCandy from './images/purple-candy.png'
import pinkCandy from './images/pink-candy.png'
import brownCandy from './images/brown-gummy.jpg'
import blank from './images/blank.png'
import ScoreBoard from "./components/ScoreBoard";

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

const width = 8;
const candyColors = [blueCandy, greenCandy, redCandy, orangeCandy, yellowCandy, purpleCandy, pinkCandy, brownCandy];

const App = () => {
  const [currentBoard, setCurrentBoard] = useState([]);
  const [currentSquare, setCurrentSquare] = useState(null);
  const [nextSquare, setNextSquare] = useState(null);
  const [score, setScore] = useState(0);
  const [beBlank, setBeBlank] = useState([]);

  const check = () => {
    const willBeBlank = [];
  
    for (let i = 0; i < width * (width - 3); i++) {
      const currentIs = [i, i + width, i + width * 2, i + width * 3];
      if (!currentBoard[i] || currentBoard[i] === blank) continue;
      if (currentIs.every(ci => currentBoard[ci] === currentBoard[i])) {
        setScore(score + 4);
        currentIs.forEach(ci => willBeBlank.push(ci));
      }
    }
  
    for (let i = 0; i < width * (width - 2); i++) {
      const currentIs = [i, i + width, i + width * 2];
      if (!currentBoard[i] || currentBoard[i] === blank) continue;
      if (currentIs.every(ci => currentBoard[ci] === currentBoard[i])) {
        setScore(score + 3);
        currentIs.forEach(ci => willBeBlank.push(ci));
      }
    }
  
    const invalidIs = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 61, 62, 63];
  
    for (let i = 0; i < width * width - 3; i++) {
      const currentIs = [i, i + 1, i + 2, i + 3];  
      if (invalidIs.includes(i) || !currentBoard[i] || currentBoard[i] === blank) continue;
      if (currentIs.every(ci => currentBoard[ci] === currentBoard[i])) {
        setScore(score + 4);
        currentIs.forEach(ci => willBeBlank.push(ci));
      }
    }
  
    const invalidIs2 = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63];
  
    for (let i = 0; i < width * width - 2; i++) {
      const currentIs = [i, i + 1, i + 2];
      if (invalidIs2.includes(i) || !currentBoard[i] || currentBoard[i] === blank) continue;
      if (currentIs.every(ci => currentBoard[ci] === currentBoard[i])) {
        setScore(score + 3);
        currentIs.forEach(ci => willBeBlank.push(ci));
      }
    }

    if (willBeBlank.length > 0) {
      setBeBlank(willBeBlank);
    }
  
  };

  const setBlank = () => {
    const willBeBlank = beBlank
    if (willBeBlank.length !== 0) {
      willBeBlank.every(ci => currentBoard[ci] = blank)
    }
    setBeBlank([]);
  }
  
  const down = () => {

      for (let i = 0; i < width*width; i++) {

        const firstRows=[0,1,2,3,4,5,6,7];
        const isFirst = firstRows.includes(i);
        if (isFirst && currentBoard[i]===blank) {
          currentBoard[i]=candyColors[Math.floor(Math.random()*candyColors.length)];
        }
        if (currentBoard[i+width]===blank) {
          currentBoard[i+width]=currentBoard[i]
          currentBoard[i]=blank
        };

      }

  };

  const dragStart = (e) => {
    setCurrentSquare(e.target);
  }
  const dragOver = (e) => {
    setNextSquare(e.target);
  }

  const dragEnd = (e) => {

    if (nextSquare) {

      const currentNumber = parseInt(currentSquare.getAttribute('data-id'));
      const nextNumber = parseInt(nextSquare.getAttribute('data-id'));
      console.log(currentNumber, nextNumber);

      const validIds = [currentNumber-1, currentNumber+1, currentNumber-width, currentNumber+width];
      const validityOne = validIds.includes(nextNumber);
      const validityTwo = nextSquare.getAttribute('src') !== blank;
      const validityThree = check()

      currentBoard[currentNumber] = nextSquare.getAttribute('src');
      currentBoard[nextNumber] = currentSquare.getAttribute('src');
      
      if (validityOne&&validityTwo) {
        console.log("valid", nextNumber, validityOne, validityTwo, validityThree);
        setCurrentSquare(null);
        setNextSquare(null);
      } else {
        console.log("invalid", nextNumber, validityOne, validityTwo, validityThree);
        console.log(validIds);
        currentBoard[currentNumber] = currentSquare.getAttribute('src');
        currentBoard[nextNumber] = nextSquare.getAttribute('src');
    };

    }

    setCurrentBoard([...currentBoard]);
  
  }

  const createBoard = () => {
    const colorList = [];
    for (let i = 0; i < width*width; i++) {
      const randomColor = candyColors[Math.floor(Math.random()*candyColors.length)];
      colorList.push(randomColor);
    };
    setCurrentBoard(colorList);
  };

  useEffect(()=>{
    createBoard();
    setScore(0);
  }, []);

  useEffect(() => {
    check();
  }, [currentBoard]);

  useEffect(() => {
    const timer = setInterval(() => {
      setBlank();
      down();
      setCurrentBoard([...currentBoard]);
    }, 200);
    return () => clearInterval(timer);
  }, [check]);

  return (
    <div className="app">
      <ScoreBoard score={score}/>
      <div className="game">
        { currentBoard.map((color, index) => (

<DndProvider backend={HTML5Backend}>
        <img 
        className={beBlank.includes(index) ? 'border' : ''}
        key={index} 
        src={color}
        alt={color}
        data-id={index}
        draggable={true}
        onDragStart={dragStart}
        onDragOver={dragOver}
        onDragEnter={(e)=>e.preventDefault()}
        onDragLeave={(e)=>e.preventDefault()}
        onDragEnd={dragEnd}
        onTouchStart={dragStart}
        onTouchMove={dragOver}
        onTouchEnd={dragEnd}
        />

</DndProvider>

        )) }
      </div>
    </div>
  );

};

export default App;
