import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Database connection details from environment variables
const dbConfig = {
  host: process.env.DB_HOST || 'localhost', // Use localhost if running locally without Docker
  user: process.env.DB_USER || 'kabs_user',
  password: process.env.DB_PASSWORD || 'kabs_password',
  database: process.env.DB_DATABASE || 'kabs_db',
};

const testDbConfig = {
  host: 'localhost',
  user: 'test_user',
  password: 'test_password',
  database: 'test_db',
};

// Create a connection pool based on the environment
let pool: mysql.Pool;
if (process.env.STAGE === 'test') {
  pool = mysql.createPool(testDbConfig); // Use test database configuration
} else {
  pool = mysql.createPool(dbConfig); // Use development database configuration
}

// Test the database connection
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to the database!');
    connection.release();
  } catch (error:any) {
    console.error('Error connecting to the database:', error.message);
  }
})();


async function clearTestDatabase() {
  try {
    await pool.query('DELETE FROM task_history');
    await pool.query('DELETE FROM tasks');
    await pool.query('DELETE FROM users');
    
    console.log('Test database cleared successfully.');
  } catch (error:any) {
    console.error('Error clearing test database:', error.message);
  }
}

export { pool, clearTestDatabase };