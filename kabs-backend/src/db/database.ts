import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Database connection details from environment variables
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
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

let pool: mysql.Pool;

function createDatabasePool() {
  if (pool) {
    return pool;
  }

  if (process.env.STAGE === 'test') {
    pool = mysql.createPool(testDbConfig);
  } else {
    pool = mysql.createPool(dbConfig);
  }

  return pool;
}

// Test the database connection
(async () => {
  try {
    const connection = await createDatabasePool().getConnection();
    console.log('Connected to the database!');
    connection.release();
  } catch (error: any) {
    console.error('Error connecting to the database:', error.message);
  }
})();

async function clearTestDatabase() {
  try {
    await pool.query('DELETE FROM task_history');
    await pool.query('DELETE FROM tasks');
    await pool.query('DELETE FROM users');

    console.log('Test database cleared successfully.');
  } catch (error: any) {
    console.error('Error clearing test database:', error.message);
  }
}

export { createDatabasePool, pool, clearTestDatabase };
