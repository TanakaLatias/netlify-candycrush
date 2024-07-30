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

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

const width = 8;
const candyColors = [blueCandy, greenCandy, redCandy, orangeCandy, yellowCandy, purpleCandy, pinkCandy, brownCandy];

const App = () => {
  const [currentBoard, setCurrentBoard] = useState([]);
  const [currentSquare, setCurrentSquare] = useState(null);
  const [nextSquare, setNextSquare] = useState(null);
  const [beBlank, setBeBlank] = useState([]);

  const check = useCallback(() => {
    const willBeBlank = [];
    
    for (let i = 0; i < width * (width - 2); i++) {
      const currentIs = [i, i + width, i + width * 2];
      if (!currentBoard[i] || currentBoard[i] === blank) continue;
      if (currentIs.every(ci => currentBoard[ci] === currentBoard[i])) {
        currentIs.forEach(ci => willBeBlank.push(ci));
      }
    }

    const invalidIs = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63];
    for (let i = 0; i < width * width - 2; i++) {
      const currentIs = [i, i + 1, i + 2];
      if (invalidIs.includes(i) || !currentBoard[i] || currentBoard[i] === blank) continue;
      if (currentIs.every(ci => currentBoard[ci] === currentBoard[i])) {
        currentIs.forEach(ci => willBeBlank.push(ci));
      }
    }
  
    if (willBeBlank.length > 0) {
      setBeBlank(willBeBlank);
    }
  }, [currentBoard]);
  

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
