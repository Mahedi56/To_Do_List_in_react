import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  password: "shawon@6279",
  host: "localhost",
  port: 5432,
  database: "tododb",
});

export default pool;
