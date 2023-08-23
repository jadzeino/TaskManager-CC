import { Request, Response } from "express";
import { pool } from "../db/database";
import bcrypt from "bcrypt";

// Interface representing the structure of a user
interface User {
  id: number;
  name: string;
  email: string;
  // Other user properties
}

// Get all users
export async function getAllUsers(req: Request, res: Response) {
  try {
    const [usersRows] = await pool.query("SELECT id, name, email FROM users");
    return res.status(200).json(usersRows);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Get a specific user by ID
export async function getUserById(req: Request, res: Response) {
  try {
    console.log("req.params ", req.params);
    const { id } = req.params;
    const [userRows] = await pool.query<any>(
      "SELECT id, name, email FROM users WHERE id = ?",
      [id]
    );
    console.log("userRows  ", userRows);
    const user = userRows[0];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Create a new user
export async function loginUser(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    // Validate the input data
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Check if the user with the given email exists in the database
    const [userRows] = await pool.query<any>(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    const user = userRows[0];

    if (!user) {
      return res
        .status(404)
        .json({ message: "User with the given email not found" });
    }

    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // If the password matches, the user is successfully logged in
    // You can add additional information or JWT token for authentication here if needed

    return res.status(200).json({
      message: "Login successful",
      userId: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("Error during user login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Create a new user
export async function createUser(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;

    // Validate the input data
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }

    // Check if the user with the given email already exists
    const [existingUserRows] = await pool.query<any>(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    const existingUser = existingUserRows[0];

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with the given email already exists" });
    }

    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const result: any = await pool.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );
    const createdUser = result[0];
    //console.log('createdUser  ', createdUser);
    const userId = createdUser.insertId;

    return res
      .status(201)
      .json({ message: "User created successfully", userId, name });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Update a user by ID
export async function updateUser(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    // Validate the input data
    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    // Check if the user with the given ID exists
    const [userRows] = await pool.query<any>(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );
    const user = userRows[0];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user in the database
    await pool.query("UPDATE users SET name = ?, email = ? WHERE id = ?", [
      name,
      email,
      id,
    ]);

    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Delete a user by ID
export async function deleteUser(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // Check if the user with the given ID exists
    const [userRows] = await pool.query<any>(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );
    const user = userRows[0];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the user from the database
    await pool.query("DELETE FROM users WHERE id = ?", [id]);

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
