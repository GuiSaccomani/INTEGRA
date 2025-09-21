import { Routes, Route } from "react-router-dom";
import ConfigPage from "./pages/ConfigPage";
import LogsPage from "./pages/LogsPage";

export default function RoutesApp() {
  return (
    <Routes>
      <Route path="/" element={<ConfigPage />} />
      <Route path="/logs" element={<LogsPage />} />
    </Routes>
  );
}
