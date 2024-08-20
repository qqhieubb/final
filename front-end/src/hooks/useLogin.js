import { useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { message } from "antd";

const useLogin = () => {
  const { login } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const loginUser = async (values) => {
    setLoading(true);
    try {
      setError(null);
      const res = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (res.status === 200) {
        message.success(data.message);
        login(data.token, data.user);
      } else if (res.status === 401) {
        setError(data.message || "Invalid credentials");
      } else {
        message.error("Login Failed!!!");
      }
    } catch (error) {
      message.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return { loginUser, error, loading };
};

export default useLogin;
