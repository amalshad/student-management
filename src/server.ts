import app from "./app";
import { connectDB } from "./config/db";

const PORT = 3000;

// Connect to MongoDB
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
});