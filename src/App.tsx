import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Library from "./pages/Library";
import Shadowing from "./pages/Shadowing";
import Passive from "./pages/Passive";
import Review from "./pages/Review";
import Progress from "./pages/Progress";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* L'app si apre direttamente sulla modalità passiva (focus telefono) */}
        <Route path="/" element={<Navigate to="/passive" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/library" element={<Library />} />
        <Route path="/shadowing" element={<Shadowing />} />
        <Route path="/passive" element={<Passive />} />
        <Route path="/review" element={<Review />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
