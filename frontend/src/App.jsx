import { BrowserRouter, Routes, Route } from "react-router-dom";
import MatchesPage from "./pages/MatchesPage";
import PlayerPoolPage from "./pages/PlayerPoolPage";
import LoadingPage from "./pages/LoadingPage";
import ResultPage from "./pages/ResultPage";
import ModifyPage from "./pages/ModifyPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MatchesPage />} />
        <Route path="/pool/:matchId" element={<PlayerPoolPage />} />
        <Route path="/loading/:matchId" element={<LoadingPage />} />
        <Route path="/result/:matchId" element={<ResultPage />} />
        <Route path="/modify/:matchId" element={<ModifyPage />} />
      </Routes>
    </BrowserRouter>
  );
}
