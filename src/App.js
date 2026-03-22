import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./pages/Main";
import { ConfigProvider, theme } from "antd";
import Trips from "./pages/Trips";
import Statistics from "./pages/Statistic";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Login from "./pages/Login";

const { darkAlgorithm } = theme;

function App() {
  return (
    <ConfigProvider theme={{ algorithm: darkAlgorithm }}>
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/statistic" element={<Statistics />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/auth" element={<Login />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
