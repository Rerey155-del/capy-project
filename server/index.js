import cors from "cors";
import express from "express";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pool } from "./db.js";

const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, "..", "data", "product.json");

app.use(cors());
app.use(express.json());

const readLocalData = async () => {
  const file = await readFile(dataPath, "utf8");
  return JSON.parse(file);
};

const fetchTableOrFallback = async (tableName) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM \`${tableName}\``);
    return rows;
  } catch (error) {
    console.warn(`MySQL ${tableName} tidak tersedia, memakai data lokal.`);
    const data = await readLocalData();
    return data[tableName] || [];
  }
};

app.get("/", (req, res) => {
  res.json({
    message: "Capy Express API berjalan",
    endpoints: ["/data_produk", "/data_bengkel", "/api/health"],
  });
});

app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch (error) {
    res.status(503).json({ status: "ok", database: "disconnected" });
  }
});

app.get("/data_produk", async (req, res) => {
  const products = await fetchTableOrFallback("data_produk");
  res.json(products);
});

app.get("/data_bengkel", async (req, res) => {
  const workshops = await fetchTableOrFallback("data_bengkel");
  res.json(workshops);
});

app.listen(port, () => {
  console.log(`Express API berjalan di http://localhost:${port}`);
});
