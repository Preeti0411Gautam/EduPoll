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

const allowedOrigins = [
  "https://edu-poll.vercel.app",
  "http://localhost:5173",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json());

app.use("/", teacherRoutes);

app.get("/", (req, res) => {
  res.send("Hello there");
});

const port = process.env.PORT || 3000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

pollSocket(io);

server.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});
