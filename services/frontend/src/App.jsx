import React from "react";
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import User from "./pages/User";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/browse" element={<Browse/>} />
        <Route path="/users/:id" element={<User/>} />
      </Routes>
    </Router>
  );
};
export default App;
