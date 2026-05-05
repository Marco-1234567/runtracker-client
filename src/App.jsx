import { BrowserRouter, Routes, Route } from "react-router-dom";
import ConnectStrava from "./components/ConnectStrava";
import StravaCallback from "./components/StravaCallback";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ConnectStrava />} />
        <Route path="/callback" element={<StravaCallback />} />
        <Route path="/dashboard" element={<div>Dashboard coming soon!</div>} />
      </Routes>
    </BrowserRouter>
  );
}
