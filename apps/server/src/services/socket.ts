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

      // const emailToSocketIdMap = new Map();
      const socketIdToEmailMap = new Map();

      socket.on(
        "event:joinRoom",
        ({ roomId, userId }: { roomId: string; userId: string }) => {
          console.log("Room Id", roomId);
          console.log("userId", userId);

          // emailToSocketIdMap.set(userId, socket.id);
          socketIdToEmailMap.set(socket.id, userId);

          io.to(roomId).emit("event:UserJoined", { userId, id: socket.id });

          socket.join(roomId);
          console.log("New User Joined in Room", { userId, id: socket.id });
          io.to(socket.id).emit("event:joinRoom", { roomId, userId });
        }
      );

      socket.on(
        "event:callUser",
        ({ to, offer }: { to: string; offer: RTCSessionDescriptionInit }) => {
          console.log("User CAlling", { to, offer });

          io.to(to).emit("incoming:call", {
            from: socket.id,
            offer,
          });
        }
      );

      socket.on(
        "call:accepted",
        ({ to, answer }: { to: string; answer: RTCSessionDescriptionInit }) => {
          console.log("User Accepted your Call", { to, answer });

          io.to(to).emit("call:accepted", {
            from: socket.id,
            answer,
          });
        }
      );

      socket.on(
        "peer:nego:needed",
        ({ offer, to }: { offer: RTCSessionDescriptionInit; to: string }) => {
          io.to(to).emit("peer:nego:needed", {
            from: socket.id,
            offer,
          });
        }
      );
      socket.on(
        "peer:nego:done",
        ({ to, answer }: { to: string; answer: RTCSessionDescriptionInit }) => {
          io.to(to).emit("peer:nego:final", {
            from: socket.id,
            answer,
          });
        }
      );

      // Disconnection Socket
      socket.on("disconnect", (reason) => {
        console.log(`User ${socket.id} disconnected. Reason: ${reason}`);

        // emailToSocketIdMap.delete(userId, socket.id);
        socketIdToEmailMap.delete(socket.id);

        // Additional cleanup or actions can be performed here
      });
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
