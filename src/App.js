import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NameInputPage from './NameInputPage';
import SpinningWheel from './SpinningWheel';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NameInputPage />} />
        <Route path="/wheel" element={<SpinningWheel />} />
      </Routes>
    </Router>
  );
};

export default App;