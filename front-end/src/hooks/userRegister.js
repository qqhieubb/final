import { useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { message } from "antd";

const useRegister = () => {
  const { login } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const registerUser = async (values) => {
    // Basic validation: check if password and confirm password match
    if (values.password !== values.passwordConfirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      setError(null);
      const res = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (res.status === 201) {
        message.success(data.message);
        login(data.token, data.user);
      } else if (res.status === 400) {
        setError(data.message);
      } else {
        message.error("Registration Failed!!!");
      }
    } catch (error) {
      message.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return { registerUser, error, loading };
};

export default useRegister;
