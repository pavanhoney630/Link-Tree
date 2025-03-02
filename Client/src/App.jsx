import React from "react";
import { Routes, Route } from "react-router-dom";
import Signup from "./Components/Signup"; // Adjust path if different
import Login from "./Components/Login"
import LandingPage from "./Components/LandingPage"
import UserSelection from "./Components/UserSelection"
import LinksPage from "./Components/LinksPage";
import Appearance from "./Components/Appearance"
import Analytics from "./Components/Analytics"
import Settings from "./Components/Settings"
import "./App.css"; 

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login"  element={<Login />}/>
      <Route path="/user"   element={<UserSelection/>}/>
      <Route path="/links"  element={<LinksPage/>}/>
      <Route path="/appearance" element={<Appearance />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}

export default App;
