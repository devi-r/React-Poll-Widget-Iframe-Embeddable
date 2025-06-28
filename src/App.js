import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./components/HomePage";
import PollWidgetPage from "./components/PollWidgetPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/poll-widget" element={<PollWidgetPage />} />
      </Routes>
    </Router>
  );
}

export default App;
