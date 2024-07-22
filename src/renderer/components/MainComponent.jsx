import React, { useRef, useEffect, useState } from 'react';
import { handleGridPress } from '../services/BoardObjectServices';

const MainComponent = ({ data, setData, sessionData }) => {
  const canvasRef = useRef(null);
  const [gridSize, setGridSize] = useState(8);
  const [cellSize, setCellSize] = useState(50); // size of each cell in the grid
  const [hoveredCell, setHoveredCell] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const drawGrid = () => {
      // context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before redrawing
      //  clear only the contexts of empty cells
      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          if (!data.boardObjects.find((obj) => obj.row === row && obj.col === col)) {
            const x = col * cellSize;
            const y = row * cellSize;
            context.clearRect(x, y, cellSize, cellSize);
          }
        }
      }

       // Draw board objects
       data.boardObjects.forEach((obj) => {
        const img = new Image();
        img.src = obj.icon;
        img.onload = () => {
          const x = obj.col * cellSize;
          const y = obj.row * cellSize;
          context.drawImage(img, x, y, cellSize, cellSize);
        };
      });

      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          const x = col * cellSize;
          const y = row * cellSize;
          context.fillStyle = (hoveredCell && hoveredCell.row === row && hoveredCell.col === col) ? '#333333' : '#00000000';
         
          // if there is not a board object in the cell, draw a rectangle
          if (!data.boardObjects.find((obj) => obj.row === row && obj.col === col)) {
            context.fillRect(x, y, cellSize, cellSize);
            context.strokeRect(x, y, cellSize, cellSize);
          }
        }
      }

     
    };

    drawGrid();
  }, [gridSize, cellSize, hoveredCell, data.boardObjects]);

  const handleMouseMove = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);

    if (col >= 0 && col < gridSize && row >= 0 && row < gridSize) {
      setHoveredCell({ row, col });
    } else {
      setHoveredCell(null);
    }
  };

  const handleMouseLeave = () => {
    setHoveredCell(null);
  };

  const handleMouseClick = () => {
    if (hoveredCell) {
      const { row, col } = hoveredCell;
      // if not dropping an item, return
      if (!sessionData.droppingItem.isDroppingItem) {
        return;
      }
      handleGridPress(row, col, sessionData.droppingItem.item, data, setData);
    }
  };

  return (
    <div className="main-component">
      <canvas
        ref={canvasRef}
        width={gridSize * cellSize}
        height={gridSize * cellSize}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleMouseClick}
      />
    </div>
  );
};

export default MainComponent;
