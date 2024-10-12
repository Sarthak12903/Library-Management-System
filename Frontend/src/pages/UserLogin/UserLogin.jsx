import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";
import UserCredNavbar from "../../components/UserCredNavbar/UserCredNavbar";
import { useDispatch } from "react-redux";
import { addEmail } from "../../app/userSlice";

export default function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:${
          import.meta.env.VITE_SERVER_PORT
        }/resultUser/${email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${password}`,
          },
        }
      );

      if (response.ok) {
        const result = await response.json();

        if (result && result.length > 0) {
          const user = result[0];
          if (user.email === email && user.password === password) {
            dispatch(addEmail(email));
            navigate("/userDashboard");
          } else {
            alert("Invalid username or password");
          }
        } else {
          alert("No user found with this email");
        }
      } else {
        alert("Login Failed: " + response.statusText);
      }
    } catch (error) {
      alert("Login Failed: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200">
      <UserCredNavbar />
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            User Login
          </h1>
          <form onSubmit={submit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email ID
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  className="pl-10 w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  className="pl-10 w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <button
              className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300 flex items-center justify-center"
              type="submit"
            >
              <LogIn className="mr-2" size={20} />
              Login
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account? Contact admin
          </p>
        </div>
      </div>
    </div>
  );
}
