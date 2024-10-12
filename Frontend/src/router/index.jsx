import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home/Home";
import AdminLogIn from "../pages/AdminLogin/AdminLogin";
import AdminRegister from "../pages/AdminRegister/AdminRegister";
import AdminDashboard from "../pages/AdminDashboard/AdminDashboard";
import UserLogin from "../pages/UserLogin/UserLogin";
import UserDashboard from "../pages/UserDashboard/UserDashboard";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/adminLogIn" element={<AdminLogIn />} />
        <Route path="/adminRegister" element={<AdminRegister />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/userLogIn" element={<UserLogin />} />
        <Route path="/userDashboard" element={<UserDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
