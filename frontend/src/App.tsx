import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
// import WeeklyPage from "./pages/WeeklyPage"

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: "1rem" }}>
        <Link to="/">Home</Link> |{" "}
        <Link to="/admin">Admin</Link> |{" "}
        <Link to="/login">Login</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/weekly" element={<WeeklyPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
