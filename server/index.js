import { nanoid } from "nanoid";
import express from "express";
import cors from "cors";
import pool from "./db.js"; 
import bcrypt from "bcrypt";

const app = express();
const port = 5001;

// Middleware
app.use(express.json());
app.use(cors()); 
 

// Routes


// SignUp Route
app.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;


  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    //checking the email with existing
    const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "Email already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (first_name, last_name, email, pass) VALUES ($1, $2, $3, $4) RETURNING user_id",
      [firstName, lastName, email, hashedPassword]
    );

    const newUserId = result.rows[0].user_id;

    const alternateUserId = nanoid(); 

    await pool.query(
      "INSERT INTO usersAlternate (alternate_user_id, user_id) VALUES ($1, $2)",
      [alternateUserId, newUserId]
    );

    res.status(200).json({
      message: "Sign-up successful!",
      userId: alternateUserId, 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
});



// login route

app.post("/login", async (req, res) => {
  const { email, pass } = req.body;

  try {
    
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const match = await bcrypt.compare(pass, result.rows[0].pass);

    if (!match) {
      return res.status(400).json({ error: "Incorrect password" });
    }

    const currentUserId = result.rows[0].user_id;
    const alternateUserId = nanoid();

    const insertResult = await pool.query(
      "INSERT INTO usersAlternate (alternate_user_id, user_id) VALUES ($1, $2) RETURNING alternate_user_id",
      [alternateUserId, currentUserId]
    );

    res.json({
      message: "Login successful",
      userId: insertResult.rows[0].alternate_user_id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Get all todos for the logged-in user


app.get("/todos", async (req, res) => {
  if (!req.headers["user-id"]) { // ❌ Removed query param check, ✅ Added headers check
    return res.status(401).json({ error: "User not logged in" });
  }

  const alternateUserId = req.headers["user-id"]; // ✅ Extracted from headers

  try {
    const result = await pool.query(
      `SELECT T.* 
       FROM todoitems T
       JOIN usersAlternate UA ON T.user_id = UA.user_id
       WHERE UA.alternate_user_id = $1`,
      [alternateUserId]
    );

    res.json(result.rows); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});


// Create a todo for current user
app.post("/itemInsert", async (req, res) => {
  const alternateUserId = req.headers["user-id"]; // ✅ Extract from headers

  if (!alternateUserId) {
    return res.status(401).json({ error: "User not logged in" });
  }

  const { id, todo_item, is_completed } = req.body;
  try {
    const userResult = await pool.query(
      "SELECT user_id FROM usersAlternate WHERE alternate_user_id = $1",
      [alternateUserId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "Invalid alternate user ID" });
    }

    const userId = userResult.rows[0].user_id;

    const result = await pool.query(
      "INSERT INTO todoitems (id, todo_item, is_completed, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [id, todo_item, is_completed, userId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add todo" });
  }
});

// Update a todo item
app.put("/todos/:id", async (req, res) => {
  const alternateUserId = req.headers["user-id"]; // ✅ Read from headers
  if (!alternateUserId) {
    return res.status(401).json({ error: "User not logged in" });
  }

  const { id } = req.params;
  const { is_completed } = req.body;

  try {
    const result = await pool.query(
      `UPDATE todoitems T
       SET is_completed = $1
       FROM usersAlternate UA
       WHERE T.id = $2 AND T.user_id = UA.user_id AND UA.alternate_user_id = $3
       RETURNING T.*`, 
      [is_completed, id, alternateUserId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Todo not found or not authorized" });
    }

    res.json({ message: "Todo updated!" }); // ✅ Uses JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update todo" });
  }
});

// Delete a todo item
app.delete("/todos/:id", async (req, res) => {
  const alternateUserId = req.headers["user-id"]; // ✅ Read from headers
  if (!alternateUserId) {
    return res.status(401).json({ error: "User not logged in" });
  }

  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM todoitems T
       USING usersAlternate UA
       WHERE T.id = $1 AND T.user_id = UA.user_id AND UA.alternate_user_id = $2
       RETURNING T.*`, 
      [id, alternateUserId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Todo not found or not authorized" });
    }

    res.json({ message: "Todo deleted!" }); // ✅ Uses JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete todo" });
  }
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
