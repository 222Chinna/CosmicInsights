import "./App.css";
import Home from "./pages/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StarLanding from "./pages/StarLanding";
import AsteroidLanding from "./pages/AsteroidLanding";
import ExoplanetLanding from "./pages/ExoplanetLanding";
import ExoplanetDetailsPage from "./pages/ExoplanetDetailsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/star" element={<StarLanding />} />
        <Route path="/asteroid" element={<AsteroidLanding />} />
        <Route path="/exoplanet" element={<ExoplanetLanding />} />
        <Route path="/exoplanet/:planetName" element={<ExoplanetDetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
