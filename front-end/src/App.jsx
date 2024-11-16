import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Header from "./components/header/Header";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Verify from "./pages/auth/Verify";
import Footer from "./components/footer/Footer";
import About from "./pages/about/About";
import Account from "./pages/account/Account";
import { UserData } from "./context/UserContext";
import Loading from "./components/loading/Loading";
import Courses from "./pages/courses/Courses";
// import CourseDescription from "./pages/coursedescription/CourseDescription";
import CourseDescV2 from "./pages/coursedescription/CourseDescV2";
import PaymentSuccess from "./pages/paymentsuccess/PaymentSuccess";
import Dashboard from "./pages/dashboard/Dashboard";
import CourseStudy from "./pages/coursestudy/CourseStudy";
import Lecture from "./pages/lecture/Lecture";
import AdminDashboard from "./admin/Dashboard/AdminDashboard";
import AdminCourses from "./admin/Courses/AdminCourses";
import AdminUsers from "./admin/Users/AdminUsers";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import CategoryManagement from "./admin/Category/CategoryManagement";
import { CartProvider } from "./context/CartContext";

const App = () => {
  const { isAuth, user, loading } = UserData();

  // Kiểm tra xem người dùng có phải là Admin hoặc Instructor hay không
  const isAdmin = user && user.role === "Admin";
  const isInstructor = user && user.role === "Instructor";

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <BrowserRouter>
          <CartProvider>
            <Header isAuth={isAuth} user={user} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/courses" element={<Courses user={user}/>} />
            <Route
              path="/account"
              element={isAuth ? <Account user={user} /> : <Login />}
            />
            <Route path="/login" element={isAuth ? <Home /> : <Login />} />
            <Route
              path="/register"
              element={isAuth ? <Home /> : <Register />}
            />
            <Route path="/verify" element={isAuth ? <Home /> : <Verify />} />
            <Route
              path="/forgot"
              element={isAuth ? <Home /> : <ForgotPassword />}
            />
            <Route
              path="/reset-password/:token"
              element={isAuth ? <Home /> : <ResetPassword />}
            />
            <Route
              path="/course/:id"
              element={isAuth ? <CourseDescV2 user={user} /> : <Login />}
            />
            <Route
              path="/payment-success/:id"
              element={isAuth ? <PaymentSuccess user={user} /> : <Login />}
            />
            <Route
              path="/:id/dashboard"
              element={isAuth ? <Dashboard user={user} /> : <Login />}
            />
            <Route
              path="/course/study/:id"
              element={isAuth ? <CourseStudy user={user} /> : <Login />}
            />
            <Route
              path="/lectures/:id"
              element={isAuth ? <Lecture user={user} /> : <Login />}
            />

            {/* Các route chỉ dành cho Admin */}
            {isAdmin && (
              <>
                <Route
                  path="/admin/dashboard"
                  element={<AdminDashboard user={user} />}
                />
                <Route
                  path="/admin/course"
                  element={<AdminCourses user={user} />}
                />
                <Route
                  path="/admin/users"
                  element={<AdminUsers user={user} />}
                />
                <Route
                  path="/admin/categories"
                  element={<CategoryManagement />}
                />
              </>
            )}

            {/* Route dành cho Instructor, có quyền truy cập vào AdminDashboard và AdminCourses */}
            {isInstructor && (
              <>
                <Route
                  path="/admin/dashboard"
                  element={<AdminDashboard user={user} />}
                />
                <Route
                  path="/admin/course"
                  element={<AdminCourses user={user} />}
                />
              </>
            )}
          </Routes>
          <Footer />
          </CartProvider>

        </BrowserRouter>
      )}
    </>
  );
};

export default App;
