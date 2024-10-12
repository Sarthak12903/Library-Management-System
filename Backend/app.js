const express = require("express");
const dotenv = require("dotenv");
const pool = require("./config/db");
const cors = require("cors");

dotenv.config();
const app = express();
const port = process.env.SERVER_PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/register", async (req, res) => {
  const { email, password, phoneNumber, address, name } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const { nanoid } = await import("nanoid");
  const uniqueId = nanoid();

  const query = `
    INSERT INTO admin (unique_id, name, email, password, address, number) 
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`; // Added RETURNING *

  try {
    const values = [uniqueId, name, email, password, address, phoneNumber];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]); // Send the inserted data back to the client
  } catch (error) {
    console.error("Error inserting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/resultAdmin/:email", async (req, res) => {
  const email = req.params.email;

  const query = `SELECT * FROM admin WHERE email = $1`;

  try {
    const result = await pool.query(query, [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "False" });
    }
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  const query = `DELETE FROM "user" WHERE unique_id = $1 RETURNING *`;

  try {
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/resultUser", async (req, res) => {
  const email = req.params.email;

  const query = `SELECT * FROM "user" `;

  try {
    const result = await pool.query(query);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "False" });
    }
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/resultUser/:email", async (req, res) => {
  const email = req.params.email;

  const query = `SELECT * FROM "user" WHERE email = $1`;

  try {
    const result = await pool.query(query, [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "False" });
    }
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/UserRegister", async (req, res) => {
  const { name, email, password, number, role, status } = req.body;

  if (!name || !email || !password || !number || !role || !status) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const { nanoid } = await import("nanoid");
  const uniqueId = nanoid(); // Generate a unique ID for this request

  const query = `
    INSERT INTO "user" (unique_id, name, email, password, number, role, status) 
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;

  try {
    const result = await pool.query(query, [
      uniqueId,
      name,
      email,
      password,
      number,
      role,
      status,
    ]);

    if (result.rows.length === 0) {
      console.error("No rows returned from insert query.");
      return res.status(404).json({ message: "Failed to add user" });
    }
    res.status(201).json(result.rows[0]); // Return the inserted user
  } catch (error) {
    console.error("Error adding user:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});
app.post("/addBook", async (req, res) => {
  const { title, author, isbn, copies } = req.body;

  if (!title || !author || !isbn || !copies) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const { nanoid } = await import("nanoid");
  const uniqueId = nanoid(); // Generate a unique ID for this request

  const query = `
    INSERT INTO "addBook" (unique_id, title, author, isbn, copies) 
    VALUES ($1, $2, $3, $4, $5) RETURNING *`;

  try {
    const result = await pool.query(query, [
      uniqueId,
      title,
      author,
      isbn,
      copies,
    ]);

    if (result.rows.length === 0) {
      console.error("No rows returned from insert query.");
      return res.status(404).json({ message: "Failed to add Book" });
    }
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding user:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

app.get("/allBook", async (req, res) => {
  const query = `SELECT * FROM "addBook"`;
  try {
    const result = await pool.query(query);

    if (result.rows.length === 0) {
      console.error("No books found");
      return res.status(404).json({ message: "No books available" });
    }

    res.status(200).json(result.rows); // Send all books, not just the first one
  } catch (error) {
    console.error("Error retrieving books:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

app.post("/borrowBook", async (req, res) => {
  const { title, author, isbn, borrowDate, dueDate } = req.body;

  if (!title || !author || !isbn || !borrowDate || !dueDate) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const { nanoid } = await import("nanoid");
  const uniqueId = nanoid(); // Generate a unique ID for this request

  const query = `
  INSERT INTO "borrowBook" (unique_id, title, author, isbn, "borrowDate", "dueDate") 
  VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;

  try {
    const result = await pool.query(query, [
      uniqueId,
      title,
      author,
      isbn,
      borrowDate,
      dueDate,
    ]);

    if (result.rows.length === 0) {
      console.error("No rows returned from insert query.");
      return res.status(404).json({ message: "Failed to add Book" });
    }
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding user:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

app.get("/adminBorrowBook", async (req, res) => {
  const query = `SELECT * FROM "borrowBook"`;
  try {
    const result = await pool.query(query);

    if (result.rows.length === 0) {
      console.error("No books found");
      return res.status(404).json({ message: "No books available" });
    }

    res.status(200).json(result.rows); // Send all books, not just the first one
  } catch (error) {
    console.error("Error retrieving books:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

app.delete("/deleteBook/:id", async (req, res) => {
  const id = req.params.id;
  const query = `DELETE FROM "borrowBook" WHERE unique_id = $1 RETURNING *`;

  try {
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.delete("/deleteBooks/:id", async (req, res) => {
  const id = req.params.id;
  const query = `DELETE FROM "borrowBook" WHERE isbn = $1 RETURNING *`;

  try {
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log("Server is running on: ", port);
});
