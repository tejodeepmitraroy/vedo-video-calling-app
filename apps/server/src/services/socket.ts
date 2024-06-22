import { Server } from "socket.io";

class SocketService {
  private _io: Server;

  constructor() {
    console.log("Init Socket Server");
    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      },
    });
  }

  public initListeners() {
    const io = this.io;
    console.log("init Socket Listner.....");
    io.on("connection", (socket) => {
      console.log("New socket connected", socket.id);

      const emailToSocketIdMap = new Map();
      const socketIdToEmailMap = new Map();

      socket.on(
        "event:joinRoom",
        ({ roomId, userId }: { roomId: string; userId: string }) => {
          console.log("Room Id", roomId);
          console.log("userId", userId);

          emailToSocketIdMap.set(userId, socket.id);
          socketIdToEmailMap.set(socket.id, userId);

          io.to(roomId).emit("event:UserJoined", { userId, id: socket.id });
          socket.join(roomId);
          io.to(socket.id).emit("event:joinRoom", { roomId, userId });
        }
      );

      // Disconnection Socket
      socket.on("disconnect", (reason) => {
        console.log(`User ${socket.id} disconnected. Reason: ${reason}`);
        // Additional cleanup or actions can be performed here
      });
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
