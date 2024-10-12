import { useCallback, useEffect, useState } from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useNavigate } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const sections = [
  { id: "addBook", title: "📚 Add Book" },
  { id: "manageUsers", title: "👥 Manage Users" },
  { id: "borrowedBooks", title: "📖 View Borrowed Books" },
];

const initialUsers = [
  {
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
    status: "Active",
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    role: "librarian",
    status: "Active",
  },
  {
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "member",
    status: "Inactive",
  },
];

export default function Component() {
  const [activeSection, setActiveSection] = useState("addBook");
  const [users, setUsers] = useState(initialUsers);
  const [currentPage, setCurrentPage] = useState(1);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [editingUser, setEditingUser] = useState(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toggler, setToggler] = useState(true);
  const [modified, setModified] = useState(false);
  const navigate = useNavigate();
  const usersPerPage = 10;

  const filteredUsers = users.filter(
    (user) =>
      (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (roleFilter === "all" || user.role === roleFilter)
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const addBook = async (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.bookTitle.value;
    const author = form.bookAuthor.value;
    const isbn = form.bookISBN.value;
    const copies = form.bookCopies.value;

    const response = await fetch(`${import.meta.env.VITE_LOCALHOST}/addBook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Add this line
      },
      body: JSON.stringify({ title, author, isbn, copies }),
    });
    if (response.ok) {
      alert("Book has been added!");
    } else {
      alert("Book Not added");
    }
    form.reset();
  };

  const closeModal = () => {
    setEditingUser(null);
    setIsAddingUser(false);
    setError(null);
  };

  const fetchData = useCallback(async () => {
    try {
      const response1 = await fetch(
        `${import.meta.env.VITE_LOCALHOST}/resultUser`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response1.ok) {
        const addedUser = await response1.json();
        console.log("User received successfully:", addedUser);

        setUsers(addedUser);
        closeModal();
      } else {
        const errorData = await response1.json();
        setError(`Failed to add user: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      setError(`Failed to fetch user: ${error.message || "Unknown error"}`);
    }
  }, [setUsers, closeModal, setError]);

  useEffect(() => {
    fetchBook();
    fetchData();
  }, [modified, toggler]);

  const fetchBook = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_LOCALHOST}/adminBorrowBook`,
        { method: "GET" }
      );
      if (response.ok) {
        const data = await response.json(); // Await this to resolve properly
        setBorrowedBooks(data); // Set the fetched data
      } else {
        console.log("Issue with fetch");
      }
    } catch (error) {
      console.log("Failed in getting books: ", error);
    }
  };

  const saveUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (editingUser) {
      const updatedUsers = users.map((user) =>
        user.email === editingUser.email
          ? {
              ...user,
              name: e.target.editUserName.value,
              role: e.target.editUserRole.value,
            }
          : user
      );
      setUsers(updatedUsers);
      closeModal();
    } else {
      const newUser = {
        name: e.target.editUserName.value,
        email: e.target.editUserEmail.value,
        password: e.target.editUserPassword.value,
        number: e.target.editUserNumber.value,
        role: e.target.editUserRole.value,
        status: "Active",
      };
      try {
        const response = await fetch(
          `${import.meta.env.VITE_LOCALHOST}/UserRegister`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newUser),
          }
        );

        if (response.ok) {
          const addedUser = await response.json();
          console.log("User added successfully:", addedUser);
          setModified((prev) => !prev);
          closeModal();
        } else {
          const errorData = await response.json();
          setError(
            `Failed to add user: ${errorData.message || "Unknown error"}`
          );
        }
      } catch (error) {
        console.error("Error adding user:", error);
        setError(`Error adding user: ${error.message}`);
      }
    }
    setIsLoading(false);
  };

  const deleteUser = async (unique_id) => {
    console.log(unique_id);
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_LOCALHOST}/delete/${unique_id}`,
          { method: "DELETE" }
        );

        if (response.ok) {
          alert("Successfully deleted");
        } else {
          console.error("Error deleting user:", await response.json());
          alert("Error deleting user");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        alert("Network error. Please try again.");
      }
    }
  };
  const cancelBorrow = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_LOCALHOST}/deleteBook/${id}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        const result = await response.json();
        setToggler((prev) => !prev);
        console.log("SUCCESS in deleting:", result);
      } else {
        console.log("Failed to delete. Status:", response.statusText);
      }
    } catch (error) {
      console.log("Failed to delete: ", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <nav className="bg-gray-800 p-4 flex justify-between items-center text-white">
        <h1 className="text-2xl">
          Admin Dashboard - Library Management System
        </h1>
        <button
          className="px-4 py-2 bg-red-600 rounded-lg"
          onClick={() => navigate("/")}
        >
          Log Out
        </button>
      </nav>
      <div className="flex flex-col md:flex-row flex-1">
        <aside className="w-full md:w-64 bg-gray-700 p-5 text-white">
          <ul>
            {sections.map(({ id, title }) => (
              <li key={id} className="my-5">
                <button
                  onClick={() => setActiveSection(id)}
                  className="text-lg w-full text-left py-2 px-4 hover:bg-green-500 transition duration-300 rounded"
                >
                  {title}
                </button>
              </li>
            ))}
          </ul>
        </aside>
        <main className="flex-1 p-5">
          {activeSection === "addBook" && (
            <div>
              <h3 className="text-xl mb-4">Add a New Book</h3>
              <form onSubmit={addBook} className="space-y-4">
                <div>
                  <label htmlFor="bookTitle" className="block mb-1">
                    Book Title:
                  </label>
                  <input
                    type="text"
                    id="bookTitle"
                    name="bookTitle"
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label htmlFor="bookAuthor" className="block mb-1">
                    Author:
                  </label>
                  <input
                    type="text"
                    id="bookAuthor"
                    name="bookAuthor"
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label htmlFor="bookISBN" className="block mb-1">
                    ISBN:
                  </label>
                  <input
                    type="text"
                    id="bookISBN"
                    name="bookISBN"
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label htmlFor="bookCopies" className="block mb-1">
                    Copies:
                  </label>
                  <input
                    type="number"
                    id="bookCopies"
                    name="bookCopies"
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
                >
                  Add Book
                </button>
              </form>
            </div>
          )}
          {activeSection === "manageUsers" && (
            <div>
              <h3 className="text-xl mb-4">Manage Users</h3>
              <div className="mb-4 flex justify-between items-center">
                <input
                  type="text"
                  placeholder="Search by name or email"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="p-2 border rounded"
                />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-1/3 p-2 border rounded"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="librarian">Librarian</option>
                  <option value="member">Member</option>
                </select>
                <button
                  onClick={() => setIsAddingUser(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Add New User
                </button>
              </div>
              <div className="overflow-auto">
                <table className="table-auto w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border px-4 py-2">Name</th>
                      <th className="border px-4 py-2">Email</th>
                      <th className="border px-4 py-2">Role</th>
                      <th className="border px-4 py-2">Status</th>
                      <th className="border px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.map((user, index) => (
                      <tr key={index}>
                        <td className="border px-4 py-2">{user.name}</td>
                        <td className="border px-4 py-2">{user.email}</td>
                        <td className="border px-4 py-2">{user.role}</td>
                        <td className="border px-4 py-2">{user.status}</td>
                        <td className="border px-4 py-2">
                          {/* <button
                            onClick={() => setEditingUser(user)}
                            className="mr-2 bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600"
                          >
                            Edit
                          </button> */}
                          <button
                            onClick={() => deleteUser(user.unique_id)}
                            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeSection === "borrowedBooks" && (
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Your Borrowed Books</h2>
              {borrowedBooks.length === 0 ? (
                <p>No borrowed books currently.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {borrowedBooks.map((book) => (
                    <div
                      key={book?.unique_id}
                      className="bg-white p-4 rounded-lg shadow-md flex"
                    >
                      <img
                        src={`https://via.placeholder.com/100x150?text=${book?.title
                          .split(" ")
                          .join("+")}`}
                        alt={book?.title}
                        className="w-24 h-36 object-cover mr-4 rounded"
                      />
                      <div>
                        <h3 className="font-bold">{book?.title}</h3>
                        <p>Author: {book?.author}</p>
                        <p>ISBN: {book?.isbn}</p>
                        <p className="text-red-600">
                          {book?.dueDate || "No timer set"}
                        </p>
                        <button
                          onClick={() => cancelBorrow(book?.unique_id)}
                          className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                        >
                          Cancel Borrow
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {isAddingUser || editingUser ? (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h3 className="text-xl mb-4">
                  {editingUser ? "Edit User" : "Add New User"}
                </h3>
                <form onSubmit={saveUser} className="space-y-4">
                  <div>
                    <label htmlFor="editUserName" className="block mb-1">
                      Name:
                    </label>
                    <input
                      type="text"
                      id="editUserName"
                      name="editUserName"
                      defaultValue={editingUser ? editingUser.name : ""}
                      required
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label htmlFor="editUserEmail" className="block mb-1">
                      Email:
                    </label>
                    <input
                      type="email"
                      id="editUserEmail"
                      name="editUserEmail"
                      defaultValue={editingUser ? editingUser.email : ""}
                      required={!editingUser}
                      readOnly={!!editingUser}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  {!editingUser && (
                    <div>
                      <label htmlFor="editUserPassword" className="block mb-1">
                        Password:
                      </label>
                      <input
                        type="password"
                        id="editUserPassword"
                        name="editUserPassword"
                        required={!editingUser}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  )}
                  <div>
                    <label htmlFor="editUserRole" className="block mb-1">
                      Role:
                    </label>
                    <select
                      id="editUserRole"
                      name="editUserRole"
                      defaultValue={editingUser ? editingUser.role : "member"}
                      required
                      className="w-full p-2 border rounded"
                    >
                      <option value="admin">Admin</option>
                      <option value="librarian">Librarian</option>
                      <option value="member">Member</option>
                    </select>
                  </div>
                  {!editingUser && (
                    <div>
                      <label htmlFor="editUserNumber" className="block mb-1">
                        Contact Number:
                      </label>
                      <input
                        type="text"
                        id="editUserNumber"
                        name="editUserNumber"
                        required={!editingUser}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  )}
                  <div className="flex justify-between">
                    <button
                      type="submit"
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      {editingUser ? "Save Changes" : "Add User"}
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}
