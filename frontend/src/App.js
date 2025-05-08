import Home from "./pages/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SolarLanding from "./pages/SolarLanding";
import AsteroidLanding from "./pages/AsteroidLanding";
import ExoplanetLanding from "./pages/ExoplanetLanding";
import SolarDetailsPage from "./pages/SolarDetailsPage";
import ExoplanetDetailsPage from "./pages/ExoplanetDetailsPage";
import AsteroidDetailsPage from "./pages/AsteroidDetailsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/solar" element={<SolarLanding />} />
        <Route path="/asteroid" element={<AsteroidLanding />} />
        <Route path="/exoplanet" element={<ExoplanetLanding />} />
        <Route path="/solar/compare" element={<SolarDetailsPage />} />
        <Route path="/exoplanet/:name" element={<ExoplanetDetailsPage />} />
        <Route path="/asteroid/:id" element={<AsteroidDetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
