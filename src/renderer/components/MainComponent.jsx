import React, { useState } from 'react';
import { handleGridPress } from '../services/BoardObjectServices';
import { hasNoOutgoingWires } from '../services/WireServices';

const MainComponent = ({ data, setData, sessionData, setSessionData }) => {
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
    handleGridPress(row, col, sessionData, data, setData, setSessionData);
  };

  const isEditingObject = (obj) => {
    return (
      sessionData.options?.open &&
      sessionData.options.currentEditItem?.row === obj.row &&
      sessionData.options.currentEditItem?.col === obj.col
    );
  };

  return (
    <div
      className="main-component"
      style={{
        position: 'relative',
        width: gridSize * cellSize,
        height: gridSize * cellSize,
        overflow: 'hidden', // Ensure wires don't extend beyond the component
      }}
    >
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      >
        {data.wires.map((wire, index) =>
          !wire.start || !wire.end ? null : (
            <line
              key={index}
              x1={wire.start.col * cellSize + cellSize / 2}
              y1={wire.start.row * cellSize + cellSize / 2}
              x2={wire.end.col * cellSize + cellSize / 2}
              y2={wire.end.row * cellSize + cellSize / 2}
              stroke="white"
              strokeWidth="2"
            />
          ),
        )}
      </svg>
      {Array.from({ length: gridSize }, (_, row) =>
        Array.from({ length: gridSize }, (_, col) => {
          const isHovered =
            hoveredCell && hoveredCell.row === row && hoveredCell.col === col;
          const boardObject = data.boardObjects.find(
            (obj) => obj.row === row && obj.col === col,
          );
          const editing = boardObject && isEditingObject(boardObject);

          return (
            <div
              key={`${row}-${col}`}
              style={{
                position: 'absolute',
                top: row * cellSize,
                left: col * cellSize,
                width: cellSize,
                height: cellSize,
                backgroundColor: isHovered
                  ? sessionData.droppingItem.isDroppingItem
                    ? '#555555' // Different hover effect when dropping an item
                    : '#333333'
                  : 'transparent',
                border: editing ? '2px solid white' : '1px solid black',
                boxSizing: 'border-box',
                boxShadow:
                  boardObject && hasNoOutgoingWires(boardObject, data.wires)
                    ? '0 0 6px 2px #cc020260'
                    : 'none',
              }}
              onMouseOver={() => handleMouseOver(row, col)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleMouseClick(row, col)}
            >
              {boardObject && (
                <img
                  src={boardObject.icon}
                  alt=""
                  style={{
                    width: '100%',
                    height: '100%',
                    opacity: isHovered ? 0.5 : 1, // Change opacity on hover
                  }}
                />
              )}
              {isHovered && sessionData.droppingItem.isDroppingItem && (
                <img
                  src={sessionData.droppingItem.item.icon}
                  alt=""
                  style={{
                    width: '100%',
                    height: '100%',
                    opacity: 0.5, // Different shade for the icon being dropped
                    position: 'absolute',
                    top: 0,
                    left: 0,
                  }}
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
