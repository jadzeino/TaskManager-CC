import { pool } from "../db/database";
import { fetchUserById } from "./dbUtils";

// Helper function to create task history
export async function createTaskHistory(
  taskId: number,
  field: string,
  oldValue: string,
  newValue: string,
  changedBy: number, // Change the parameter type to number (userId)
  changedAt: string,
  action: string // Additional parameter to specify the action performed
) {
  try {
    // Fetch the user name based on the userId
    //const userQuery = 'SELECT name FROM users WHERE id = ?';
    const userRows: any = await fetchUserById(changedBy);
    //const [userRows]:any = await pool.query(userQuery, [changedBy]);
    // Check if the user with the given userId exists
    if (!userRows) {
      // Handle the case when the user does not exist
      console.error(`User with userId ${changedBy} not found`);
      return;
    }
    const username = userRows.name;

    // Construct the appropriate message using the username
    const message = `User "${username}" ${action} at "${changedAt}"`;

    // Insert the task history entry
    const insertHistoryQuery =
      "INSERT INTO task_history (taskId, field, oldValue, newValue, changedBy, changedAt, message) VALUES (?, ?, ?, ?, ?, ?, ?)";
    await pool.query(insertHistoryQuery, [
      taskId,
      field,
      oldValue,
      newValue,
      changedBy,
      changedAt,
      message,
    ]);
  } catch (error) {
    // Handle error
    console.error("Error creating task history:", error);
  }
}

// Helper function to validate task status transition
export function validateTaskStatusTransition(
  currentStatus: string,
  newStatus: string
) {
  const allowedTransitions: { [key: string]: string[] } = {
    ToDo: ["InProgress"],
    InProgress: ["Blocked", "InQA"],
    Blocked: ["ToDo"],
    InQA: ["ToDo", "Done"],
    Done: ["Deployed"],
  };

  if (!allowedTransitions[currentStatus]) {
    throw new Error(`Invalid current status: ${currentStatus}`);
  }

  if (!allowedTransitions[currentStatus].includes(newStatus)) {
    throw new Error(
      `Invalid status transition from ${currentStatus} to ${newStatus}`
    );
  }
}
