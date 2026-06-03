import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";

// Pagine caricate on-demand: il bundle iniziale resta minuscolo.
const Home = lazy(() => import("./pages/Home"));
const Library = lazy(() => import("./pages/Library"));
const Shadowing = lazy(() => import("./pages/Shadowing"));
const Passive = lazy(() => import("./pages/Passive"));
const Review = lazy(() => import("./pages/Review"));
const Progress = lazy(() => import("./pages/Progress"));

function Loading() {
  return (
    <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>
      <div style={{ fontSize: 40 }}>🎧</div>
      <div style={{ marginTop: 10, fontWeight: 600 }}>Caricamento…</div>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
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
    </Suspense>
  );
}
