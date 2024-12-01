import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import mongoose from "mongoose"; // Import mongoose
import userRoutes from "./routes/userRoutes"; // Import userRoutes
import moderatorRoutes from "./routes/moderatorRoutes"; // Import moderatorRoutes
import adminRoutes from "./routes/adminRouter"; // Import adminRoutes

const server = express();
dotenv.config();

const mongoURL = process.env.MONGOURL;

// Connect to MongoDB
mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
server.use(
  cors({
    credentials: true,
  })
);
server.use(bodyParser.json());
server.use(express.urlencoded({ extended: false }));

// Routes
server.use(userRoutes);
server.use(adminRoutes);
server.use(moderatorRoutes);

// Start the server
try {
  server.listen(3001, () => {
    console.log("Server running on port 3001");
  });
} catch (error) {
  console.error("Failed to start server:", error);
}
