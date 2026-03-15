import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";
import { parse } from "url";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  });

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Join a specific campaign room
    socket.on("join-campaign", (campaignId) => {
      socket.join(`campaign-${campaignId}`);
      console.log(`Socket ${socket.id} joined campaign ${campaignId}`);
    });

    // Leave campaign room
    socket.on("leave-campaign", (campaignId) => {
      socket.leave(`campaign-${campaignId}`);
      console.log(`Socket ${socket.id} left campaign ${campaignId}`);
    });

    // Dice Roll event
    socket.on("roll-dice", ({ campaignId, characterId, characterName, diceType, originalResult, total, modifier, type }) => {
      io.to(`campaign-${campaignId}`).emit("dice-rolled", {
        characterId,
        characterName,
        diceType,
        originalResult,
        total,
        modifier,
        type,
        timestamp: new Date().toISOString()
      });
    });

    // Token Move event (for Map)
    socket.on("move-token", ({ campaignId, tokenId, x, y }) => {
      // Broadcast to everyone else in the campaign
      socket.to(`campaign-${campaignId}`).emit("token-moved", { tokenId, x, y });
    });

    // Character HP Update event
    socket.on("update-hp", ({ campaignId, characterId, hitPoints }) => {
      io.to(`campaign-${campaignId}`).emit("hp-updated", { characterId, hitPoints });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  server.once("error", (err) => {
    console.error(err);
    process.exit(1);
  });

  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log(`> Socket.io server mapped and ready`);
  });
});
