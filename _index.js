const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const server = express();

const mongoURL =
  "mongodb+srv://lehanselaka:Ammasandaki@testrad.9qpuq.mongodb.net/";

const userRoutes = require("./routes/userRoutes");
const moderatorRoutes = require("./routes/moderatorRoutes");
const adminRoutes = require("./routes/adminRouter");
const { mongoose } = require("mongoose");

mongoose.connect(mongoURL);

server.use(
  cors({
    credentials: true,
  })
);
server.use(bodyParser.json());
server.use(express.urlencoded({ extended: false }));

server.use(userRoutes);
server.use(adminRoutes);
server.use(moderatorRoutes);

try {
  server.listen(3001, () => {
    console.log("Server running on port 3001");
  });
} catch (error) {
  console.error("Failed to start server:", error);
}
