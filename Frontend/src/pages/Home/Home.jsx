import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserCog, Users, BookOpen } from "lucide-react";

export default function Home() {
  const [adminHover, setAdminHover] = useState(false);
  const [userHover, setUserHover] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-center text-4xl sm:text-5xl font-bold text-gray-800 mb-12">
          <BookOpen className="inline-block mr-4 h-12 w-12 text-blue-600" />
          LIBRARY MANAGEMENT SYSTEM
        </h1>

        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-700">
            Choose your role
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center space-y-8 sm:space-y-0 sm:space-x-12">
          <button
            onClick={() => navigate("/adminLogin")}
            onMouseEnter={() => setAdminHover(true)}
            onMouseLeave={() => setAdminHover(false)}
            className={`flex flex-col items-center justify-center w-64 h-64 rounded-lg shadow-md transition-all duration-300 ${
              adminHover ? "bg-blue-100 shadow-lg scale-105" : "bg-white"
            }`}
          >
            <UserCog
              className={`w-24 h-24 mb-4 ${
                adminHover ? "text-blue-600" : "text-gray-600"
              }`}
            />
            <h3
              className={`text-xl font-semibold ${
                adminHover ? "text-blue-600" : "text-gray-700"
              }`}
            >
              Admin
            </h3>
          </button>

          <button
            onClick={() => navigate("/userLogin")}
            onMouseEnter={() => setUserHover(true)}
            onMouseLeave={() => setUserHover(false)}
            className={`flex flex-col items-center justify-center w-64 h-64 rounded-lg shadow-md transition-all duration-300 ${
              userHover ? "bg-green-100 shadow-lg scale-105" : "bg-white"
            }`}
          >
            <Users
              className={`w-24 h-24 mb-4 ${
                userHover ? "text-green-600" : "text-gray-600"
              }`}
            />
            <h3
              className={`text-xl font-semibold ${
                userHover ? "text-green-600" : "text-gray-700"
              }`}
            >
              User
            </h3>
          </button>
        </div>
      </div>
    </div>
  );
}
