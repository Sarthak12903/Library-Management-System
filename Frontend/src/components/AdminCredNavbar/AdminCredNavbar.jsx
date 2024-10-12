import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, UserPlus, LogIn } from "lucide-react";

export default function AdminCredNavbar() {
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => navigate("/")}
            >
              <Home className="mr-2 h-5 w-5" />
              Go to Home
            </button>
          </div>
          <div className="flex items-center">
            <NavLink
              to="/adminRegister"
              className={({ isActive }) =>
                `inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
                  isActive
                    ? "text-white bg-blue-600 hover:bg-blue-700"
                    : "text-gray-700 bg-gray-100 hover:bg-gray-200"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ml-4`
              }
            >
              <UserPlus className="mr-2 h-5 w-5" />
              Admin Register
            </NavLink>
            <NavLink
              to="/adminLogIn"
              className={({ isActive }) =>
                `inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
                  isActive
                    ? "text-white bg-blue-600 hover:bg-blue-700"
                    : "text-gray-700 bg-gray-100 hover:bg-gray-200"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ml-4`
              }
            >
              <LogIn className="mr-2 h-5 w-5" />
              Admin Login
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
