import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Register from './Auth/Register';
import Dashboard from './pages/Dashboard';
import Login from './Auth/Login';
import Home from './pages/Home';
import Instructor from './pages/Instructor'; // Import trang Instructor
import { useAuth } from './contexts/AuthContext';

const App = () => {
  const { isAuthenticated, role } = useAuth(); // Giả sử bạn có thông tin vai trò của người dùng trong AuthContext

  return (
    <Router>
      <Routes>
        {/* Route cho Home, luôn hiển thị cho cả người dùng đã đăng nhập hoặc chưa */}
        <Route path="/" element={<Home />} />

        {/* Route cho trang đăng ký */}
        <Route
          path="/register"
          element={!isAuthenticated ? <Register /> : <Navigate to={role === 'Instructor' ? '/instructor' : '/dashboard'} />}
        />

        {/* Route cho trang đăng nhập */}
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to={role === 'Instructor' ? '/instructor' : '/dashboard'} />}
        />

        {/* Route cho Instructor nếu người dùng có vai trò Instructor */}
        <Route
          path="/instructor"
          element={isAuthenticated && role === 'Instructor' ? <Instructor /> : <Navigate to="/" />}
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
