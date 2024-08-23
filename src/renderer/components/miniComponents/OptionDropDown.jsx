const OptionDropDown = ({ label, value, onChange, children }) => {
  return (
    <div className="default-dd">
      {label}
      <select value={value} onChange={onChange}>
        {children}
      </select>
    </div>
  );
};

export default OptionDropDown;
