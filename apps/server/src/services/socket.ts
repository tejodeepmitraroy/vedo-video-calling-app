import { Server } from 'socket.io';

class SocketService {
  private _io: Server;
  // private userIdToSocketIdMap: Map<string, string>;
  private socketIdToUserIdMap: Map<string, string>;
  private hostSocketIdToRoomId: Map<string, string>;

  constructor() {
    console.log('Init Socket Server');
    this._io = new Server({
      cors: {
        allowedHeaders: ['*'],
        origin: process.env.FRONTEND_URL
      }
    });
    // this.userIdToSocketIdMap = new Map();
    this.socketIdToUserIdMap = new Map();
    this.hostSocketIdToRoomId = new Map();
  }

  public initListeners() {
    const io = this.io;
    console.log('init Socket Listner.....');
    io.on('connection', (socket) => {
      console.log('New socket connected', socket.id);

      socket.on(
        'event:hostEnterRoom',
        ({ roomId, userId }: { roomId: string; userId: string }) => {
          console.log('Host Enter the room-->', { roomId, userId });
          // this.userIdToSocketIdMap.set(userId, socket.id);
          this.socketIdToUserIdMap.set(socket.id, userId);
          this.hostSocketIdToRoomId.set(socket.id, roomId);

          socket.join(roomId);
          io.to(socket.id).emit('event:joinRoom', { roomId, userId });
          io.to(roomId).emit('notification:informAllNewUserAdded', {
            id: userId,
            socketId: socket.id
          });
          // console.log('Host User Joined in Room', {
          //   userId,
          //   roomId,
          //   id: socket.id
          // });
        }
      );

      function KeyByValue(map: Map<string, string>, KeyValue: string) {
        let result: string | undefined;

        console.log("KeyByValue",map)
        map.forEach((value, key) => {
          result = value === KeyValue ? key : result;
        });
        return result;
      }

      socket.on(
        'event:askToEnter',
        ({ roomId, userId }: { roomId: string; userId: string }) => {
          console.log('User want to ask-->', { roomId, userId });
          // this.userIdToSocketIdMap.set(userId, socket.id);
          this.socketIdToUserIdMap.set(socket.id, userId);

          console.log(
            'Host User Id--->',
            // this.roomIdToHostSocketId.get(roomId)
            KeyByValue(this.hostSocketIdToRoomId, roomId)
          );

          const hostSocketId = KeyByValue(this.hostSocketIdToRoomId, roomId);

          io.to(hostSocketId!).emit('event:userWantToEnter', {
            userId,
            id: socket.id
          });
        }
      );
      socket.on('event:roomEnterPermissionDenied', ({ id }: { id: string }) => {
        io.to(id).emit('roomEnterPermissionDenied');
      });

      socket.on(
        'event:roomEnterPermissionAccepted',
        ({
          roomId,
          userId,
          id
        }: {
          roomId: string;
          userId: string;
          id: string;
        }) => {
          socket.join(roomId);
          // io.to(socket.id).emit('event:joinRoom', { roomId, userId });

          io.to(id).emit('event:joinRoom', { userId, id });
          io.to(roomId).emit('notification:informAllNewUserAdded', {
            id: userId,
            socketId: id
          });
          io.to(id).emit('notification:informAllNewUserAdded', {
            id: userId,
            socketId: id
          });
          console.log('User Joined in Room', {
            userId,
            roomId,
            id: socket.id
          });
        }
      );

      socket.on(
        'event:joinRoom',
        ({ roomId, userId }: { roomId: string; userId: string }) => {
          console.log('Room Id', roomId);
          console.log('userId', userId);

          // if (!socketIdToEmailMap.get(userId)) {
          //   emailToSocketIdMap.set(userId, socket.id);
          //   socketIdToEmailMap.set(socket.id, userId);
          //   io.to(roomId).emit('event:UserJoined', { userId, id: socket.id });
          //   socket.join(roomId);
          //   console.log('New User Joined in Room', { userId, id: socket.id });
          //   io.to(socket.id).emit('event:joinRoom', { roomId, userId });
          // } else {
          //   io.to(roomId).emit('event:UserJoined', { userId, id: socket.id });
          //   console.log(' User Re:Joined in Room', { userId, id: socket.id });
          // }
          // emailToSocketIdMap.set(userId, socket.id);
          // socketIdToEmailMap.set(socket.id, userId);
          // io.to(roomId).emit('event:UserJoined', { userId, id: socket.id });
          // socket.join(roomId);
          // console.log('New User Joined in Room', { userId, id: socket.id });
          // io.to(socket.id).emit('event:joinRoom', { roomId, userId });
        }
      );

      socket.on(
        'event:callUser',
        ({ to, offer }: { to: string; offer: RTCSessionDescriptionInit }) => {
          console.log('User CAlling', { to, offer });

          io.to(to).emit('incoming:call', {
            from: socket.id,
            offer
          });
        }
      );

      socket.on(
        'call:accepted',
        ({ to, answer }: { to: string; answer: RTCSessionDescriptionInit }) => {
          console.log('User Accepted your Call', { to, answer });

          io.to(to).emit('call:accepted', {
            from: socket.id,
            answer
          });
        }
      );

      socket.on(
        'peer:nego:needed',
        ({ offer, to }: { offer: RTCSessionDescriptionInit; to: string }) => {
          io.to(to).emit('peer:nego:needed', {
            from: socket.id,
            offer
          });
        }
      );
      socket.on(
        'peer:nego:done',
        ({ to, answer }: { to: string; answer: RTCSessionDescriptionInit }) => {
          io.to(to).emit('peer:nego:final', {
            from: socket.id,
            answer
          });
        }
      );

      // Disconnection Socket
      socket.on('disconnect', (reason) => {
        console.log(`User ${socket.id} disconnected. Reason: ${reason}`);

        // this.userIdToSocketIdMap.delete(userId);
        this.socketIdToUserIdMap.delete(socket.id);
        console.log('before hostSocketIdToRoomId', this.hostSocketIdToRoomId);
        this.hostSocketIdToRoomId.delete(socket.id);
        console.log('after hostSocketIdToRoomId', this.hostSocketIdToRoomId);

        // Additional cleanup or actions can be performed here
      });
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
