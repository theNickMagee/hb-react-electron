import React, { useRef, useEffect, useState } from 'react';

const MainComponent = () => {
  const canvasRef = useRef(null);
  const [gridSize, setGridSize] = useState(8);
  const [cellSize, setCellSize] = useState(50); // size of each cell in the grid
  const [hoveredCell, setHoveredCell] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const drawGrid = () => {
      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          const x = col * cellSize;
          const y = row * cellSize;
          context.fillStyle =
            hoveredCell && hoveredCell.row === row && hoveredCell.col === col
              ? '#333333'
              : 'black';
          context.fillRect(x, y, cellSize, cellSize);
        }
      }
    };

    drawGrid();
  }, [gridSize, cellSize, hoveredCell]);

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

  const handleMouseClick = () => {};

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
