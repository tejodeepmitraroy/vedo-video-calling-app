import { Server } from "socket.io";

class SocketService {
  private _io: Server;

  constructor() {
    console.log("Init Socket Server");
    this._io = new Server();
  }

  public initListeners() {
    const io = this.io;
    console.log("init Socket Listner.....");
    io.on("connection", (socket) => {
      console.log("New socket connected", socket.id);

      socket.on("event:message",  ({ message }: { message: string }) => {
        console.log("new Message rec", message);
      });





      

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
