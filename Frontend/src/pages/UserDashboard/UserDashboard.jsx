import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Book,
  User,
  BarChart2,
  HelpCircle,
  BookOpen,
  Users,
  Clock,
  Calendar,
} from "lucide-react";

const books = [
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "9780061120084",
    image: "https://via.placeholder.com/100x150?text=To+Kill+a+Mockingbird",
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    isbn: "9780316769488",
    image: "https://via.placeholder.com/100x150?text=Catcher+in+the+Rye",
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    isbn: "9780345339683",
    image: "https://via.placeholder.com/100x150?text=The+Hobbit",
  },
  {
    title: "The Odyssey",
    author: "Homer",
    isbn: "9780140268867",
    image: "https://via.placeholder.com/100x150?text=The+Odyssey",
  },
  {
    title: "Crime and Punishment",
    author: "Fyodor Dostoevsky",
    isbn: "9780486415864",
    image: "https://via.placeholder.com/100x150?text=Crime+and+Punishment",
  },
  {
    title: "1984",
    author: "George Orwell",
    isbn: "9780451524935",
    image: "https://via.placeholder.com/100x150?text=1984",
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    isbn: "9780143105428",
    image: "https://via.placeholder.com/100x150?text=Pride+and+Prejudice",
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    isbn: "9780743273565",
    image: "https://via.placeholder.com/100x150?text=The+Great+Gatsby",
  },
  {
    title: "Brave New World",
    author: "Aldous Huxley",
    isbn: "9780060850524",
    image: "https://via.placeholder.com/100x150?text=Brave+New+World",
  },
  {
    title: "Moby Dick",
    author: "Herman Melville",
    isbn: "9781503280786",
    image: "https://via.placeholder.com/100x150?text=Moby+Dick",
  },
  {
    title: "War and Peace",
    author: "Leo Tolstoy",
    isbn: "9781420954308",
    image: "https://via.placeholder.com/100x150?text=War+and+Peace",
  },
  {
    title: "The Brothers Karamazov",
    author: "Fyodor Dostoevsky",
    isbn: "9780374528379",
    image: "https://via.placeholder.com/100x150?text=The+Brothers+Karamazov",
  },
  {
    title: "The Picture of Dorian Gray",
    author: "Oscar Wilde",
    isbn: "9781505290417",
    image:
      "https://via.placeholder.com/100x150?text=The+Picture+of+Dorian+Gray",
  },
  {
    title: "Les Misérables",
    author: "Victor Hugo",
    isbn: "9780451419439",
    image: "https://via.placeholder.com/100x150?text=Les+Misérables",
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    isbn: "9780062315007",
    image: "https://via.placeholder.com/100x150?text=The+Alchemist",
  },
];

function UserDashboard() {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [bookList, setBookList] = useState(books);
  const [activeView, setActiveView] = useState("books");
  const [searchTerm, setSearchTerm] = useState("");
  const [timers, setTimers] = useState({});
  const [toggler, setToggler] = useState(true);
  const user = useSelector((state) => state.users);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [uniqueId, setUniqueId] = useState("");
  const navigate = useNavigate();

  const viewBooks = () => setActiveView("books");
  const viewBorrowedBooks = () => setActiveView("borrowed");
  const showProfile = () => setActiveView("profile");
  const showDashboard = () => setActiveView("dashboard");

  const borrowBook = async (isbn) => {
    const book = bookList.find((b) => b.isbn === isbn);
    if (book && !borrowedBooks.some((b) => b.isbn === isbn)) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_LOCALHOST}/borrowBook`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: book.title, // Changed from bookName to title
              author: book.author,
              isbn: isbn, // Changed from bookIsbn to isbn
              borrowDate: new Date().toISOString(),
              dueDate: new Date(
                Date.now() + 4 * 24 * 60 * 60 * 1000
              ).toISOString(), // 4 days from now
            }),
          }
        );

        if (response.ok) {
          setBorrowedBooks([...borrowedBooks, book]);
          alert(`You have borrowed "${book.title}"`);
          startTimer(book.isbn);
          viewBorrowedBooks();
        } else {
          const errorData = await response.json();
          alert(
            `Failed to borrow book: ${errorData.message || "Unknown error"}`
          );
        }
      } catch (error) {
        console.error("Error borrowing book:", error);
        alert(`Error borrowing book: ${error.message}`);
      }
    } else {
      alert("This book is already borrowed or not available.");
    }
  };

  const cancelBorrow = async (isbn) => {
    console.log("Attempting to delete book with ID:",isbn);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_LOCALHOST}/deleteBooks/${isbn}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("SUCCESS in deleting:", result);
        setBorrowedBooks((prevBooks) =>
          prevBooks.filter((book) => book.isbn !== isbn)
        );
        setToggler((prev) => !prev);
      } else {
        console.log("Failed to delete. Status:", response.statusText);
        alert("Failed to delete book. Please try again.");
      }
    } catch (error) {
      console.log("Failed to delete: ", error);
      alert(`Error deleting book: ${error.message}`);
    }
  };

  const fetchBook = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_LOCALHOST}/allBook`,
        {
          method: "GET",
        }
      );
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setBookList(data);
        } else {
          console.error("Fetched data is not an array:", data);
        }
      } else {
        console.error("Error fetching books");
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchBook();

    const handleBeforeUnload = () => {
      navigate("/");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [navigate, toggler]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `http://localhost:${
          import.meta.env.VITE_SERVER_PORT
        }/resultUser/${user}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const result = await response.json();

        if (result && result.length > 0) {
          const user = result[0];
          setName(user.name);
          setEmail(user.email);
          setUniqueId(user.unique_id);
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

  const startTimer = (isbn) => {
    let timeRemaining = 4 * 24 * 60 * 60; // 4 days in seconds
    const interval = setInterval(() => {
      timeRemaining--;
      if (timeRemaining <= 0) {
        clearInterval(interval);
        setTimers((prevTimers) => ({
          ...prevTimers,
          [isbn]: "This book is overdue!",
        }));
      } else {
        const days = Math.floor(timeRemaining / (60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (60 * 60 * 24)) / (60 * 60));
        const minutes = Math.floor((timeRemaining % (60 * 60)) / 60);
        const seconds = timeRemaining % 60;
        setTimers((prevTimers) => ({
          ...prevTimers,
          [isbn]: `Time remaining: ${days}d ${hours}h ${minutes}m ${seconds}s`,
        }));
      }
    }, 1000);
  };

  const filteredBooks = bookList.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gradient-to-r from-gray-200 to-gray-300">
      <div className="w-64 bg-gray-800 p-6 flex flex-col items-center shadow-lg">
        <h2 className="text-white text-xl uppercase mb-8">Library Menu</h2>
        <ul className="space-y-4 w-full">
          <li>
            <button
              onClick={viewBooks}
              className="w-full text-white flex items-center p-3 rounded hover:bg-green-500 transition-colors"
            >
              <Book className="mr-2" />
              View Books
            </button>
          </li>
          <li>
            <button
              onClick={viewBorrowedBooks}
              className="w-full text-white flex items-center p-3 rounded hover:bg-green-500 transition-colors"
            >
              <Book className="mr-2" />
              Your Borrowed Books
            </button>
          </li>
          <li>
            <button
              onClick={showProfile}
              className="w-full text-white flex items-center p-3 rounded hover:bg-green-500 transition-colors"
            >
              <User className="mr-2" />
              Profile
            </button>
          </li>
          <li>
            <button
              onClick={showDashboard}
              className="w-full text-white flex items-center p-3 rounded hover:bg-green-500 transition-colors"
            >
              <BarChart2 className="mr-2" />
              Dashboard
            </button>
          </li>
        </ul>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="bg-gray-700 p-4 flex justify-between items-center shadow-md">
          <h1 className="text-white text-2xl">Library Management System</h1>
          <button
            className="px-4 py-3 bg-green-500 rounded-xl"
            onClick={() => navigate("/")}
          >
            LogOut
          </button>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search books..."
              className="p-2 rounded-l-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={() => setActiveView("books")}
              className="bg-green-500 text-white p-2 rounded-r-md hover:bg-green-600 transition-colors"
            >
              <Search />
            </button>
          </div>
        </div>
        {activeView === "profile" && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
            <div className="flex items-center bg-white p-6 rounded-lg shadow-md">
              <img
                src="https://media.licdn.com/dms/image/v2/D4D35AQHh7ljXaxh2zg/profile-framedphoto-shrink_400_400/profile-framedphoto-shrink_400_400/0/1723385624846?e=1728154800&v=beta&t=6qz9XRzy0g3E_ce2n4qwQ_RdLc7hXSahDUNKkjZhMKw"
                alt="Profile"
                className="w-40 h-40 rounded-full mr-8"
              />
              <div>
                <p className="text-2xl font-script mb-2">Name: {name}</p>
                <p className="text-lg mb-2">Email: {email}</p>
                {console.log(uniqueId)}
                <p className="text-lg mb-4">Membership ID: {uniqueId}</p>
                <button
                  onClick={() => navigate("/")}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        )}
        {activeView === "books" && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Available Books</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map((book) => (
                <div
                  key={book.isbn}
                  className="bg-white p-4 rounded-lg shadow-md flex"
                >
                  <img
                    src={`https://via.placeholder.com/100x150?text=${book.title
                      .split(" ")
                      .join("+")}`}
                    alt={book.title}
                    className="w-24 h-36 object-cover mr-4 rounded"
                  />
                  <div>
                    <h3 className="font-bold">{book.title}</h3>
                    <p>Author: {book.author}</p>
                    <p>ISBN: {book.isbn}</p>
                    <button
                      onClick={() => borrowBook(book.isbn)}
                      className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                    >
                      Borrow
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeView === "borrowed" && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Your Borrowed Books</h2>
            {borrowedBooks.length === 0 ? (
              <p>No borrowed books currently.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {borrowedBooks.map((book) => (
                  <div
                    key={book?.isbn}
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
                        {timers[book?.isbn]
                          ? timers[book?.isbn]
                          : "No timer set"}
                      </p>
                      <button
                        onClick={() => cancelBorrow(book?.isbn)}
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

        {activeView === "dashboard" && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Library Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-4 rounded-lg  shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500">Total Books</p>
                    <p className="text-2xl font-bold">{books.length}</p>
                  </div>
                  <BookOpen size={40} className="text-blue-500" />
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500">Borrowed Books</p>
                    <p className="text-2xl font-bold">{borrowedBooks.length}</p>
                  </div>
                  <Book size={40} className="text-green-500" />
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500">Active Users</p>
                    <p className="text-2xl font-bold">1</p>
                  </div>
                  <Users size={40} className="text-yellow-500" />
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500">Overdue Books</p>
                    <p className="text-2xl font-bold">
                      {
                        Object.values(timers).filter(
                          (timer) => timer === "This book is overdue!"
                        ).length
                      }
                    </p>
                  </div>
                  <Clock size={40} className="text-red-500" />
                </div>
              </div>
            </div>
            <div className="mt-8 bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
              <ul className="space-y-2">
                {borrowedBooks.slice(0, 5).map((book, index) => (
                  <li key={index} className="flex items-center">
                    <Calendar className="mr-2 text-gray-500" />
                    <span>
                      You borrowed "{book.title}" by {book.author}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
