import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Register from './Auth/Register';
import Dashboard from './pages/Dashboard';
import Login from './Auth/Login';
import Home from './pages/Home'; // Import trang Home
import { useAuth } from './contexts/AuthContext';

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Route cho Home, luôn hiển thị cho cả người dùng đã đăng nhập hoặc chưa */}
        <Route path="/" element={<Home />} />

        {/* Route cho trang đăng ký */}
        <Route
          path="/register"
          element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />}
        />

        {/* Route cho trang đăng nhập */}
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />}
        />

        {/* Route cho Dashboard */}
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
        />

        {/* Route mặc định, chuyển hướng về Home nếu route không tồn tại */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
