const Menu = (data, setData, sessionData, setSessionData) => {
  return (
    <div className="menu">
      {/* display options of activeBoardObject */}
      <DefaultMenuOptions />
      {/* if not, displayboardObjects as options  */}
      {/* always display - play, create wire, cut wire */}
      <ControlMenuOptions />
    </div>
  );
};

export default Menu;

const DefaultMenuOptions = () => {
  return (
    // buttons for wavFile, Amp, Midi, Oscillator, Switch
    <div className="default-menu-options">
      <BoardItemOption title="WavFile" />
      <BoardItemOption title="Amp" />
      <BoardItemOption title="Midi" />
      <BoardItemOption title="Oscillator" />
      <BoardItemOption title="Switch" />
    </div>
  );
};

const ControlMenuOptions = () => {
  return (
    // buttons for play, create wire, cut wire
    <div className="control-menu-options">
      <div className="default-button">Play</div>
      <div className="default-button">Create Wire</div>
      <div className="default-button">Cut Wire</div>
    </div>
  );
};

const BoardItemOption = ({ image, title, on, onColor, offColor, onClick }) => {
  return <div className="default-button">{title}</div>;
};
