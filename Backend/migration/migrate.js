const fs = require("fs");
const path = require("path");
const pool = require("../config/db"); // Path to your database configuration

async function runMigrations() {
  const client = await pool.connect(); // Get a client from the pool
  try {
    // Define the path to your SQL migration file
    const schemaPath = path.join(__dirname, "../schema/schema.sql");

    // Read the SQL file
    const schema = fs.readFileSync(schemaPath, "utf-8");

    // Start a transaction
    await client.query("BEGIN");

    // Execute the SQL commands
    await client.query(schema);

    // Commit the transaction
    await client.query("COMMIT");
    console.log("Database migration completed successfully.");
  } catch (error) {
    // Rollback the transaction in case of error
    await client.query("ROLLBACK");
    console.error("Error running migrations:", error);
  } finally {
    // Release the client back to the pool
    client.release();
  }
}

// Run the migration
runMigrations().catch((err) => console.error("Migration script failed:", err));
