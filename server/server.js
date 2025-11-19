const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { errorHandler } = require("./middlewares/errorMiddleWare");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL?.split(",") || "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  },
});

// Make io accessible in controllers
app.set("io", io);

// Accept JSON
app.use(cors({ origin: process.env.FRONTEND_URL?.split(",") || "*" }));
app.use(express.json());

// Socket.io connection events
io.on("connection", (socket) => {
  console.log("⚡ Client Connected:", socket.id);

  socket.on("joinRestaurant", (restaurantId) => {
    socket.join(`restaurant:${restaurantId}`);
    console.log(`📌 Socket joined room: restaurant:${restaurantId}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client Disconnected:", socket.id);
  });
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tables", require("./routes/tableRoutes"));
app.use("/api/menu", require("./routes/menuRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/restaurant", require("./routes/restaurantRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

// Health check
app.get("/", (req, res) => {
  res.send("Restaurant API is running");
});

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
