import { pool } from "../db/database";

export async function fetchUserById(
  userId: number
): Promise<string | undefined> {
  const userQuery = "SELECT * FROM users WHERE id = ?";
  const [userRows]: any = await pool.query(userQuery, [userId]);
  return userRows.length ? userRows[0] : undefined;
}
