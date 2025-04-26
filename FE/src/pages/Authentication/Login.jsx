import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "./helper/axiosInstance";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(null);
  const { login } = useContext(AuthContext);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/api/login", {
        username,
        password,
      });

      // localStorage.setItem('accessToken', response.data.accessToken);
      // localStorage.setItem('refreshToken', response.data.refreshToken);

      setMessage({ type: "success", text: "Login successful! Welcome back." });
      login(response.data.accessToken, response.data.refreshToken);
      navigate("/");
    } catch (err) {
      setMessage({
        type: "error",
        text: "Login failed. Please check your credentials.",
      });
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 bg-[#0b1c39] flex flex-col justify-center items-start px-20 text-white">
        <h1 className="text-4xl font-bold mb-6">
          Hello! Ready to tell a new story today?
        </h1>
        <p className="text-lg opacity-80">
          We’re glad to have you here. Let’s get started!
        </p>
      </div>

      <div className="w-1/2 bg-gray-100 flex flex-col justify-center items-center px-10 relative">
        {message && (
          <div
            className={`absolute top-6 px-6 py-3 rounded shadow-md transition-all duration-300 ${
              message.type === "success"
                ? "bg-green-100 text-green-800 border border-green-300"
                : "bg-red-100 text-red-800 border border-red-300"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="w-full max-w-md">
          <div className="flex justify-center mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-full" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-5">
            Sign In
          </h2>

          <form className="flex flex-col gap-4" onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              className="border rounded px-4 py-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="border rounded px-4 py-2 w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-500 hover:underline"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <div className="flex justify-between items-center text-sm">
              <Link
                to="/forgot-password"
                className="text-blue-500 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white py-2 rounded mt-2 hover:bg-blue-600"
            >
              Sign In
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-600">
            <Link to="/register" className="text-blue-500 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
