import { createPoll, voteOnOption } from "../controllers/pollController.js";

let votes = {};
let connectedUsers = {};

export default function pollSocket(io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("createPoll", async (pollData) => {
      votes = {};
      const poll = await createPoll(pollData);
      io.emit("pollCreated", poll);
    });

    socket.on("kickOut", (userToKick) => {
      for (let id in connectedUsers) {
        if (connectedUsers[id] === userToKick) {
          io.to(id).emit("kickedOut", { message: "You have been kicked out." });
          const userSocket = io.sockets.sockets.get(id);
          if (userSocket) userSocket.disconnect(true);
          delete connectedUsers[id];
          break;
        }
      }
      io.emit("participantsUpdate", Object.values(connectedUsers));
    });

    socket.on("joinChat", ({ username }) => {
      connectedUsers[socket.id] = username;
      io.emit("participantsUpdate", Object.values(connectedUsers));

      socket.on("disconnect", () => {
        delete connectedUsers[socket.id];
        io.emit("participantsUpdate", Object.values(connectedUsers));
      });
    });

    socket.on("studentLogin", (name) => {
      socket.emit("loginSuccess", { message: "Login successful", name });
    });

    socket.on("chatMessage", (message) => {
      io.emit("chatMessage", message);
    });

    socket.on("submitAnswer", (answerData) => {
      votes[answerData.option] = (votes[answerData.option] || 0) + 1;
      voteOnOption(answerData.pollId, answerData.option);
      io.emit("pollResults", votes);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
}
