import express from "express";
import path from "path";
import studentRoutes from "./routes/student.routes";

const app = express();

app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, "../public")));

app.use("/students", studentRoutes);

export default app;