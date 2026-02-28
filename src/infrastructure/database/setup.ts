import mysql from 'mysql2/promise';

export async function setupDatabase(connectionUri: string) {
  const connection = await mysql.createConnection(connectionUri);
  try {
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS urls (
        id INT PRIMARY KEY,
        longUrl VARCHAR(2048) NOT NULL,
        hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Database table 'urls' ensured.");
  } finally {
    await connection.end();
  }
}
