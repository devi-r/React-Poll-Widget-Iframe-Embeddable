import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./components/HomePage";
import PollWidgetPage from "./components/PollWidgetPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PollWidgetPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
