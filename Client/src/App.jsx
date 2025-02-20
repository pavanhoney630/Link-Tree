import React from "react";
import { Routes, Route } from "react-router-dom";
import Signup from "./Components/Signup"; // Adjust path if different
import Login from "./Components/Login"
import LandingPage from "./Components/LandingPage"
import UserSelection from "./Components/UserSelection"

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login"  element={<Login />}/>
      <Route path="/user"   element={<UserSelection/>}/>
    </Routes>
  );
}

export default App;
