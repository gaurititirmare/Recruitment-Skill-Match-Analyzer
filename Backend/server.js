// server.js - Express app that serves /api/analyze and /api/upload
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import analyzerRouter from "./routes/analyzer.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));

app.use("/api/analyze", analyzerRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`RMS backend listening on port ${PORT}`);
});
