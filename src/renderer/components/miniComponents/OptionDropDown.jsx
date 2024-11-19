const OptionDropDown = ({ label, value, onChange, children }) => {
  return (
    <div style={{ fontSize: '0.8rem' }}>
      {label}
      <select value={value} onChange={onChange} className="default-dd">
        {children}
      </select>
    </div>
  );
};

export default OptionDropDown;
