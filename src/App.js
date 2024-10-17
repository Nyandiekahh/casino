import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NameInputPage from './NameInputPage';
import SpinningWheel from './SpinningWheel';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Set SpinningWheel as the homepage */}
        <Route path="/" element={<SpinningWheel />} />
        {/* Set NameInputPage as another route */}
        <Route path="/name-input" element={<NameInputPage />} />
      </Routes>
    </Router>
  );
};

export default App;
