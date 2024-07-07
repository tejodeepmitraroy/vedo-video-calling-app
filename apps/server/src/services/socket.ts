import { Server } from 'socket.io';

class SocketService {
  private _io: Server;
  // private userIdToSocketIdMap: Map<string, string>;
  private socketIdToUserIdMap: Map<string, string>;
  private hostSocketIdToRoomId: Map<string, string>;
  private rooms: any;

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
    this.rooms = {};
  }

  public initListeners() {
    const io = this.io;
    console.log('init Socket Listner.....');
    io.on('connection', (socket) => {
      console.log('New socket connected', socket.id);

      // socket.on(
      //   'event:hostEnterRoom',
      //   ({ roomId, userId }: { roomId: string; userId: string }) => {
      //     console.log('Host Enter the room-->', { roomId, userId });
      //     // this.userIdToSocketIdMap.set(userId, socket.id);
      //     // this.socketIdToUserIdMap.set(socket.id, userId);
      //     // this.hostSocketIdToRoomId.set(socket.id, roomId);

      //     // socket.join(roomId);
      //     io.to(socket.id).emit('event:joinRoom', {
      //       roomId,
      //       socketId: socket.id,
      //       userId,
      //       hostUser: true
      //     });

      //     console.log('Host User Joined in Room', {
      //       userId,
      //       roomId,
      //       id: socket.id
      //     });
      //   }
      // );

      function KeyByValue(map: Map<string, string>, KeyValue: string) {
        let result: string | undefined;

        console.log('KeyByValue', map);
        map.forEach((value, key) => {
          result = value === KeyValue ? key : result;
        });
        return result;
      }

      socket.on(
        'event:askToEnter',
        ({
          roomId,
          username,
          profilePic
        }: {
          roomId: string;
          username: string | null | undefined;
          profilePic: string | null | undefined;
        }) => {
          console.log('User want to ask-->', { roomId, username, profilePic });

          // console.log(
          //   'Host User Id--->',
          //   KeyByValue(this.hostSocketIdToRoomId, roomId)
          // );

          const hostSocketId = KeyByValue(this.hostSocketIdToRoomId, roomId);

          if (hostSocketId) {
            io.to(hostSocketId!).emit('event:userWantToEnter', {
              username,
              profilePic,
              socketId: socket.id
            });
          } else {
            io.to(socket.id).emit('notification:hostIsNoExistInRoom', {});
          }
        }
      );
      socket.on(
        'event:roomEnterPermissionDenied',
        ({ socketId }: { socketId: string }) => {
          io.to(socketId).emit('notification:roomEnterPermissionDenied');
        }
      );

      socket.on(
        'event:roomEnterPermissionAccepted',
        ({ socketId }: { socketId: string }) => {
          console.log('Host accepted');

          io.to(socketId).emit('event:joinRoom', {
            hostUserSocketId: socket.id
          });

          console.log('User Joined in Room', {
            hostUserSocketId: socket.id
          });
        }
      );

      socket.on(
        'event:joinRoom',
        ({
          roomId,
          userId,
          username,
          hostUser
        }: {
          roomId: string;
          userId: string;
          username: string;
          hostUser: boolean;
        }) => {
          console.log('Room Id', roomId);
          console.log('userId', userId);
          console.log('hostUser', hostUser);
          console.log('username', username);

          console.log('Current socket ID--->', socket.id);

          if (!this.rooms[roomId]) {
            this.rooms[roomId] = [];
          }
          this.socketIdToUserIdMap.set(socket.id, userId);

          if (hostUser) {
            this.hostSocketIdToRoomId.set(socket.id, roomId);
            console.log('Host User socket Id is add');
          }

          socket.join(roomId);
          this.rooms[roomId].push(socket.id);

          io.to(socket.id).emit('event:enterRoom', {});

          io.to(roomId).emit('notification:informAllNewUserAdded', {
            userId,
            username,
            socketId: socket.id
          });

          console.log('User Joined in Room', {
            userId,
            username,
            roomId,
            socketId: socket.id
          });

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

      socket.on(
        'event:callEnd',
        ({ roomId, userId }: { roomId: string; userId: string }) => {
          io.to(roomId).emit('notification:userLeftTheRoom', { userId });
          socket.leave(roomId);
          console.log(
            'Leaving before hostSocketIdToRoomId',
            this.hostSocketIdToRoomId
          );
          this.hostSocketIdToRoomId.delete(socket.id);
          console.log(
            ' Leaving after hostSocketIdToRoomId',
            this.hostSocketIdToRoomId
          );
        }
      );

      socket.on("disconnecting", () => {

        const roomId = Array.from(socket.rooms)[1];

        const userId = this.socketIdToUserIdMap.get(socket.id);
        console.log('userId--->', userId);



         io.to(roomId).emit('notification:userLeftTheRoom', { userId });

        // socket.rooms.forEach((item) => {
        //   console.log('Socket Rooms---->', item);
        // });

        console.log('Socket Rooms---->', Array.from(socket.rooms)[1]);
     // the Set contains at least the socket ID
  });

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
