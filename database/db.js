import mysql from "mysql2";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "TooJoo_1967",
  database: "AI_review",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function queryDB(sql, params) {
  const connection = await pool.promise().getConnection(); // Get a connection from the pool
  try {
    const [rows] = await connection.query(sql, params);
    return rows;
  } catch (error) {
    throw error;
  } finally {
    connection.release(); // Release the connection back to the pool
  }
}

async function validateAdmin(id) {
  try {
    const query = "SELECT * FROM adminCred where username = ?";
    const params = [id];
    return await queryDB(query, params);
  } catch (error) {
    console.error(error);
  }
}

export { validateAdmin };
