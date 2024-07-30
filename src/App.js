import { useEffect, useState, useCallback } from "react";
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

  const [five1, setFive1] = useState(false);
  const [five2, setFive2] = useState(false);
  const [four1, setFour1] = useState(false);
  const [four2, setFour2] = useState(false);
  const [three1, setThree1] = useState(false);
  const [three2, setThree2] = useState(false);

  const check = useCallback(() => {
    const willBeBlank = [];
    
    for (let i = 0; i < width * (width - 4); i++) {
      const currentIs = [i, i + width, i + width * 2, i + width * 3, i + width * 4];
      if (!currentBoard[i] || currentBoard[i] === blank) continue;
      if (currentIs.every(ci => currentBoard[ci] === currentBoard[i])) {
        setFive1(true);
        currentIs.forEach(ci => willBeBlank.push(ci));
      }
    }

    for (let i = 0; i < width * (width - 3); i++) {
      const currentIs = [i, i + width, i + width * 2, i + width * 3];
      if (!currentBoard[i] || currentBoard[i] === blank) continue;
      if (currentIs.every(ci => currentBoard[ci] === currentBoard[i])) {
        setFour1(true);
        currentIs.forEach(ci => willBeBlank.push(ci));
      }
    }
    
    for (let i = 0; i < width * (width - 2); i++) {
      const currentIs = [i, i + width, i + width * 2];
      if (!currentBoard[i] || currentBoard[i] === blank) continue;
      if (currentIs.every(ci => currentBoard[ci] === currentBoard[i])) {
        setThree1(true);
        currentIs.forEach(ci => willBeBlank.push(ci));
      }
    }
    
    const invalidIs0 = [4, 5, 6, 7, 12, 13, 14, 15, 20, 21, 22, 23, 28, 29, 30, 31, 36, 37, 38, 39, 44, 45, 46, 47, 52, 53, 54, 55, 60, 61, 62, 63];
    for (let i = 0; i < width * width - 4; i++) {
      const currentIs = [i, i + 1, i + 2, i + 3, i + 4];
      if (invalidIs0.includes(i) || !currentBoard[i] || currentBoard[i] === blank) continue;
      if (currentIs.every(ci => currentBoard[ci] === currentBoard[i])) {
        setFive2(true);
        currentIs.forEach(ci => willBeBlank.push(ci));
      }
    }

    const invalidIs = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 61, 62, 63];
    for (let i = 0; i < width * width - 3; i++) {
      const currentIs = [i, i + 1, i + 2, i + 3];
      if (invalidIs.includes(i) || !currentBoard[i] || currentBoard[i] === blank) continue;
      if (currentIs.every(ci => currentBoard[ci] === currentBoard[i])) {
        setFour2(true);
        currentIs.forEach(ci => willBeBlank.push(ci));
      }
    }
    
    const invalidIs2 = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63];
    for (let i = 0; i < width * width - 2; i++) {
      const currentIs = [i, i + 1, i + 2];
      if (invalidIs2.includes(i) || !currentBoard[i] || currentBoard[i] === blank) continue;
      if (currentIs.every(ci => currentBoard[ci] === currentBoard[i])) {
        setThree2(true);
        currentIs.forEach(ci => willBeBlank.push(ci));
      }
    }

    if (five1) {
      setScore(prevScore => prevScore + 1);
      setFive1(false);
    };
    if (four1) {
      setScore(prevScore => prevScore + 1);
      setFour1(false);
    };
    if (three1) {
      setScore(prevScore => prevScore + 3);
      setThree1(false);
    };
    if (five2) {
      setScore(prevScore => prevScore + 1);
      setFive2(false);
    };
    if (four2) {
      setScore(prevScore => prevScore + 1);
      setFour2(false);
    };
    if (three2) {
      setScore(prevScore => prevScore + 3);
      setThree2(false);
    };
  
    if (willBeBlank.length > 0) {
      setBeBlank(willBeBlank);
    }
  }, [currentBoard, five1, five2, four1, four2, three1, three2]);
  

  const setBlank = useCallback(() => {
    const willBeBlank = beBlank;
    if (willBeBlank.length !== 0) {
      willBeBlank.forEach(ci => currentBoard[ci] = blank);
    }
    setBeBlank([]);
  }, [beBlank, currentBoard]);
  
  const down = useCallback(() => {
    for (let i = 0; i < width * width; i++) {
      const firstRows = [0, 1, 2, 3, 4, 5, 6, 7];
      const isFirst = firstRows.includes(i);
      if (isFirst && currentBoard[i] === blank) {
        currentBoard[i] = candyColors[Math.floor(Math.random() * candyColors.length)];
      }
      if (currentBoard[i + width] === blank) {
        currentBoard[i + width] = currentBoard[i];
        currentBoard[i] = blank;
      }
    }
  }, [currentBoard]);

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

      currentBoard[currentNumber] = nextSquare.getAttribute('src');
      currentBoard[nextNumber] = currentSquare.getAttribute('src');
      
      if (validityOne&&validityTwo) {
        console.log("valid", nextNumber, validityOne, validityTwo);
        setCurrentSquare(null);
        setNextSquare(null);
      } else {
        console.log("invalid", nextNumber, validityOne, validityTwo);
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

  useEffect(() => {
    createBoard();
    setScore(0);
  }, []);
  
  useEffect(() => {
    check();
  }, [check]);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setBlank();
      down();
      setCurrentBoard([...currentBoard]);
    }, 200);
    return () => clearInterval(timer);
  }, [currentBoard, beBlank, setBlank, down]);

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
