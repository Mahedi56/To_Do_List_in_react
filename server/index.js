import { nanoid } from "nanoid";
import express from "express";
import cors from "cors";
import pool from "./db.js"; 
const app = express();
const port = 5001;

// Middleware
app.use(express.json());
app.use(cors());


// Routes

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

    if (result.rows[0].pass !== pass) {
      return res.status(400).json({ error: "Incorrect password" });
    }
    const currentUserId = result.rows[0].user_id;
    const alternateUserId = nanoid();
    const insertResult = await pool.query(
      "INSERT INTO usersAlternate (alternate_user_id, user_id) VALUES ($1, $2) RETURNING alternate_user_id",
      [alternateUserId, currentUserId]
    );

    res.json({ message: "Login successful", userId: insertResult.rows[0].alternate_user_id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Get all todos for the logged-in user
app.get("/todos", async (req, res) => {
  if (!req.query["user-id"]) {
    return res.status(401).json({ error: "User not logged in" });
  }

  const alternateUserId = req.query["user-id"]; 

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
  if (!req.query['user-id']) {
    return res.status(401).json({ error: "User not logged in" });
  }

  const { id, todo_item, is_completed } = req.body;
  const alternateUserId = req.query['user-id']; 

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


// Update a todo
app.put("/todos/:id", async (req, res) => {
  if (!req.query["user-id"]) {
    return res.status(401).json({ error: "User not logged in" });
  }

  const alternateUserId = req.query["user-id"]; 
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

    res.json("Todo updated!");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update todo" });
  }
});


// Delete a todo
app.delete("/todos/:id", async (req, res) => {
  if (!req.query["user-id"]) {
    return res.status(401).json({ error: "User not logged in" });
  }

  const alternateUserId = req.query["user-id"]; 
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

    res.json("Todo deleted!");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete todo" });
  }
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
