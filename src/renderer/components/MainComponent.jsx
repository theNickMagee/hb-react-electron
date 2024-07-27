import React, { useState } from 'react';
import { handleGridPress } from '../services/BoardObjectServices';

const MainComponent = ({ data, setData, sessionData }) => {
  const gridSize = 8;
  const cellSize = 50; // size of each cell in the grid
  const [hoveredCell, setHoveredCell] = useState(null);

  const handleMouseOver = (row, col) => {
    setHoveredCell({ row, col });
  };

  const handleMouseLeave = () => {
    setHoveredCell(null);
  };

  const handleMouseClick = (row, col) => {
    if (!sessionData.droppingItem.isDroppingItem) {
      return;
    }
    handleGridPress(row, col, sessionData.droppingItem.item, data, setData);
  };

  return (
    <div
      className="main-component"
      style={{
        position: 'relative',
        width: gridSize * cellSize,
        height: gridSize * cellSize,
      }}
    >
      {Array.from({ length: gridSize }, (_, row) =>
        Array.from({ length: gridSize }, (_, col) => {
          const isHovered =
            hoveredCell && hoveredCell.row === row && hoveredCell.col === col;
          const boardObject = data.boardObjects.find(
            (obj) => obj.row === row && obj.col === col,
          );
          return (
            <div
              key={`${row}-${col}`}
              style={{
                position: 'absolute',
                top: row * cellSize,
                left: col * cellSize,
                width: cellSize,
                height: cellSize,
                backgroundColor: isHovered ? '#333333' : 'transparent',
                border: '1px solid black',
                boxSizing: 'border-box',
              }}
              onMouseOver={() => handleMouseOver(row, col)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleMouseClick(row, col)}
            >
              {boardObject && (
                <img
                  src={boardObject.icon}
                  alt=""
                  style={{ width: '100%', height: '100%' }}
                />
              )}
            </div>
          );
        }),
      )}
    </div>
  );
};

export default MainComponent;
