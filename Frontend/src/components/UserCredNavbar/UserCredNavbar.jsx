import { NavLink, useNavigate } from "react-router-dom";

export default function UserCredNavbar() {
  const navigate = useNavigate();
  return (
    <div className="border-2 border-black p-6 rounded-xl shadow-2xl">
      <div className="flex justify-between">
        <button
          className="bg-green-500 ml-12 text-white px-4 py-3 rounded-xl active:bg-green-900"
          onClick={() => navigate("/")}
        >
          Go to Home
        </button>
        <ul className="flex justify-center items-center space-x-6 mr-12">
          <li>
            <NavLink
              to="/userLogIn"
              className={({ isActive }) =>
                `px-4 py-3 border-2 ${
                  isActive ? "bg-orange-600 border-none" : ""
                } border-black rounded-lg`
              }
            >
              User LogIn
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
}
