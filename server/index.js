import express from "express";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import pollSocket from "./sockets/pollSocket.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/", teacherRoutes);
app.get("/", (req, res) => res.send("Hello there"));

const port = process.env.PORT || 3000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"], credentials: true },
});

// Socket Logic
pollSocket(io);

server.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});
