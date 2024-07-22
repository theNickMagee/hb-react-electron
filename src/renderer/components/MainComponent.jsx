const MainComponent = () => {
  return (
    <div className="main-component">
      {Array.from({ length: 8 }, (_, rowIndex) => (
        <div key={rowIndex} className="grid-row">
          {Array.from({ length: 8 }, (_, colIndex) => (
            <GridSpace key={colIndex} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default MainComponent;

const GridSpace = () => {
  return <div className="grid-space"></div>;
};
