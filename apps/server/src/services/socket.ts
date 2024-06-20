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
        ({ roomId, email }: { roomId: string; email: string }) => {
          console.log("Room Id", roomId);
          console.log("email", email);

          emailToSocketIdMap.set(email, socket.id);
          socketIdToEmailMap.set(socket.id, email);

          io.to(socket.id).emit("event:joinRoom", { roomId, email });
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
