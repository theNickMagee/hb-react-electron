import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import MainApp from './components/MainApp';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainApp />} />
      </Routes>
    </Router>
  );
}
