import { BrowserRouter, Routes, Route } from "react-router-dom";
import ConnectStrava from "./components/ConnectStrava";
import StravaCallback from "./components/StravaCallback";
import Dashboard from "./components/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ConnectStrava />} />
        <Route path="/callback" element={<StravaCallback />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/dashboard" element={<div>Dashboard NOT coming soon!</div>} /> */}
      </Routes>
    </BrowserRouter>
  );
}
